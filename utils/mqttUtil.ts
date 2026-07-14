import { Client, Message } from 'paho-mqtt';
import { AppState, AppStateStatus } from 'react-native';
import { getDeviceUid, printErrorLog, printInfoLog } from '@/utils/commUtil';

let client: Client | null = null;
let connectPromise: Promise<boolean> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let appStateInitialized = false;

type MessageCallback = (msg: string, topic: string) => void;
type DeliveredCallback = (msg: string, topic: string) => void;

const topicSubscribers = new Map<string, Map<string, MessageCallback>>();
const deliveredSubscribers = new Map<string, DeliveredCallback>();

const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const subscribeAllTrackedTopics = () => {
  if (!client || !client.isConnected()) {
    return;
  }

  topicSubscribers.forEach((_subscribers, topic) => {
    try {
      client!.subscribe(topic);
    } catch (e) {
      printErrorLog(`MQTT Resubscribe Exception : ${JSON.stringify(e)}`);
    }
  });
};

const reconnectAndRestoreSubscriptions = async () => {
  const isConnected = await connectMqtt();
  if (!isConnected) {
    return false;
  }

  subscribeAllTrackedTopics();
  return true;
};

const scheduleReconnect = () => {
  clearReconnectTimer();
  reconnectTimer = setTimeout(() => {
    reconnectAndRestoreSubscriptions();
  }, 1000);
};

const setupAppStateListener = () => {
  if (appStateInitialized) {
    return;
  }

  appStateInitialized = true;
  AppState.addEventListener('change', (nextState: AppStateStatus) => {
    if (nextState === 'active' && topicSubscribers.size > 0) {
      reconnectAndRestoreSubscriptions();
    }
  });
};

/**
 * MQTT INIT
 * @param clientId 
 * @param topic 
 * @param msgReceiveCallback 
 * @param msgSendCallback 
 */
const ensureClient = async (): Promise<Client> => {
  setupAppStateListener();

  if (client == null) {
    client = new Client(
      `${process.env.EXPO_PUBLIC_MQTT_URL}`,        // host
      Number(process.env.EXPO_PUBLIC_MQTT_PORT),    // port
      "/mqtt",                                      // path
      await getDeviceUid()
    );
  }

  return client;
};

const bindClientEvents = (mqttClient: Client) => {
  mqttClient.onConnectionLost = (response) => {
    connectPromise = null;
      if (response.errorCode !== 0) {
          printInfoLog('connection Lost : ', response.errorMessage);
      scheduleReconnect();
      }
  }

  mqttClient.onMessageArrived = (message) => {
    const topic = message.destinationName;
    const payload = message.payloadString;
    printInfoLog(`MQTT Message Arrived TOPIC :${topic} MSG : ${payload}`);

    const subscribers = topicSubscribers.get(topic);
    if (!subscribers || subscribers.size === 0) {
      return;
    }

    subscribers.forEach((callback) => {
      try {
        callback(payload, topic);
      } catch (e) {
        printErrorLog(`MQTT Message callback error : ${String(e)}`);
      }
    });
  }

  mqttClient.onMessageDelivered = (message) => {
    const topic = message.destinationName;
    const payload = message.payloadString;
    printInfoLog(`MQTT Message Delivered TOPIC :${topic} MSG : ${payload}`);

    deliveredSubscribers.forEach((callback) => {
      try {
        callback(payload, topic);
      } catch (e) {
        printErrorLog(`MQTT Delivered callback error : ${String(e)}`);
      }
    });
  }
};

const connectMqtt = async (): Promise<boolean> => {
  const mqttClient = await ensureClient();

  if (mqttClient.isConnected()) {
    return true;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = new Promise<boolean>((resolve) => {
    try {
        bindClientEvents(mqttClient);
        mqttClient.connect({
          useSSL: `${process.env.EXPO_PUBLIC_ENV}` === 'local' ? false : true,
          onSuccess: (success) => {
            printInfoLog(`MQTT Connected : ${JSON.stringify(success)}`);
            clearReconnectTimer();
            connectPromise = null;
            resolve(true);
          },
          onFailure: (error) => {
            printInfoLog(`MQTT Connect Failed : ${JSON.stringify(error)}`);
            connectPromise = null;
            resolve(false);
          },
        });
    }
    catch (e) {
      printInfoLog(`MQTT Connect Exception : ${JSON.stringify(e)}`);
      connectPromise = null;
      resolve(false);
    }
  });

  return connectPromise;
};

/**
 * topic 구독 (화면/컨텍스트 별 콜백)
 */
const subscribe = async (topic: string, subscriberId: string, msgReceiveCallback: MessageCallback): Promise<boolean> => {
  const connected = await connectMqtt();
  if (!connected || !client) {
    return false;
  }

  const subscribers = topicSubscribers.get(topic) ?? new Map<string, MessageCallback>();
  const hadAnySubscribers = subscribers.size > 0;
  subscribers.set(subscriberId, msgReceiveCallback);
  topicSubscribers.set(topic, subscribers);

  if (!hadAnySubscribers) {
    client.subscribe(topic);
  }

  return true;
};

/**
 * topic 구독 해제 (화면/컨텍스트 별 콜백)
 */
const unsubscribe = (topic: string, subscriberId: string) => {
  if (!topicSubscribers.has(topic)) {
    return;
  }

  const subscribers = topicSubscribers.get(topic)!;
  subscribers.delete(subscriberId);

  if (subscribers.size === 0) {
    topicSubscribers.delete(topic);
    if (client && client.isConnected()) {
      try {
        client.unsubscribe(topic);
      } catch (e) {
        printErrorLog(`MQTT Unsubscribe Exception : ${JSON.stringify(e)}`);
      }
    }
  }
};

/**
 * 특정 subscriber의 모든 topic 구독 해제
 */
const unsubscribeAll = (subscriberId: string) => {
  Array.from(topicSubscribers.keys()).forEach((topic) => {
    unsubscribe(topic, subscriberId);
  });
};

/**
 * topic 목록 일괄 구독
 * - 기존 subscriberId 구독은 모두 해제 후 topic_list로 재구성
 */
const subscribeTopicList = async (topics: string[], subscriberId: string, messageCallback: MessageCallback) => {
  const isConnected = await connectMqtt();
  if (!isConnected) {
    return false;
  }

  unsubscribeAll(subscriberId);

  const topicSet = new Set((topics ?? []).filter(Boolean));
  if (topicSet.size === 0) {
    return true;
  }

  const results = await Promise.all(
    Array.from(topicSet).map((topic) => subscribe(topic, subscriberId, messageCallback))
  );

  return results.every(Boolean);
};

/**
 * 메시지 전달 콜백 등록
 */
const addDeliveredListener = (listenerId: string, callback: DeliveredCallback) => {
  deliveredSubscribers.set(listenerId, callback);
};

/**
 * 메시지 전달 콜백 제거
 */
const removeDeliveredListener = (listenerId: string) => {
  deliveredSubscribers.delete(listenerId);
};

/**
 * MQTT INIT (기존 호출부 호환)
 * 기존 시그니처: initMqtt(topic, onReceive, onDelivered)
 */
const initMqtt = async (topic: string, msgReceiveCallback : (msg : string) => void, msgSendCallback : (msg : string) => void): Promise<boolean> => {
  const legacySubscriberId = `legacy:${topic}`;
  const connected = await subscribe(topic, legacySubscriberId, (msg) => msgReceiveCallback(msg));
  if (!connected) {
    return false;
  }

  addDeliveredListener(legacySubscriberId, (msg) => msgSendCallback(msg));
  return true;
};

/**
 * 메시지 전달 (JSON/String)
 * @param topic 
 * @param payload 
 */
const sendMessage = (topic : string, payload: string | object) => {
  if (!client || !client.isConnected()) {
    printInfoLog('MQTT send failed : client is not connected');
    return;
  }

  const messagePayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const message = new Message(messagePayload);
  message.destinationName = topic;
  message.qos = 1; // QoS 설정
  client.send(message);
}

/**
 * 연결 해제
 */
const disconnect = () => {
  clearReconnectTimer();

  if (client != null) {
    client.disconnect();
    client = null;
  }

  connectPromise = null;
  topicSubscribers.clear();
  deliveredSubscribers.clear();
}

export const MqttUtil = {
  connectMqtt             : connectMqtt,
  subscribe               : subscribe,
  unsubscribe             : unsubscribe,
  unsubscribeAll          : unsubscribeAll,
  subscribeTopicList      : subscribeTopicList,
  addDeliveredListener    : addDeliveredListener,
  removeDeliveredListener : removeDeliveredListener,
  initMqtt                : initMqtt,
  sendMessage             : sendMessage,
  disconnect              : disconnect
}
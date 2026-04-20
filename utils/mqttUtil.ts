import { Client, Message } from 'paho-mqtt';
import { getDeviceUid, printErrorLog, printInfoLog } from './commUtil';

let client: Client;

const MQTT_URL = 'ws://146.56.105.2:9001';

/**
 * MQTT INIT
 * @param clientId 
 * @param topic 
 * @param msgReceiveCallback 
 * @param msgSendCallback 
 */
const initMqtt = async (topic: string, msgReceiveCallback : (msg : string) => void, msgSendCallback : (msg : string) => void): Promise<boolean> => {
    if (client == null) {
        client = new Client(
            "146.56.105.2", // host
            9001,           // port
            "/mqtt",        // path
            await getDeviceUid()
        );

        client.onConnectionLost = (response) => {
            if (response.errorCode !== 0) {
                printInfoLog('connection Lost : ', response.errorMessage);
            }
        }

        client.onMessageArrived = (message) => {
            printInfoLog(`MQTT Message Arrived TOPIC :${message.destinationName} MSG : ${message.payloadString}`);
            msgReceiveCallback(message.payloadString);
        }

        client.onMessageDelivered = (message) => {
            printInfoLog(`MQTT Message Delivered TOPIC :${message.destinationName} MSG : ${message.payloadString}`);
            msgSendCallback(message.payloadString);
        }

    }

    return new Promise<boolean>((resolve) => {
        try {
            if (client.isConnected()) {
                client.subscribe(topic);
                resolve(true);
                return;
            }

            client.connect({
                onSuccess: (success) => {
                    printInfoLog(`MQTT Connected : ${JSON.stringify(success)}`);
                    client.subscribe(topic);
                    resolve(true);
                },
                onFailure: (error) => {
                    printInfoLog(`MQTT Connect Failed : ${JSON.stringify(error)}`);
                    resolve(false);
                },
                useSSL: false,
            });
        }
        catch (e) {
            printInfoLog(`MQTT Connect Exception : ${JSON.stringify(e)}`);
            resolve(false);
        }
    });
};

/**
 * 메시지 전달
 * @param topic 
 * @param payload 
 */
const sendMessage = (topic : string, payload: string) => {
    if (!client || !client.isConnected()) {
        printInfoLog('MQTT send failed : client is not connected');
        return;
    }

    const message = new Message(payload);
    message.destinationName = topic;
    message.qos = 1; // QoS 설정
    client.send(message);
}

/**
 * 연결 해제
 */
const disconnect = () => {
    if (client != null) {
        client.disconnect();
    }
}

export const MqttUtil = {
    initMqtt    : initMqtt,
    sendMessage : sendMessage,
    disconnect  : disconnect
}
import { Client, Message } from 'paho-mqtt';

let client: Client;

/**
 * mqtt 설정
 */
const initMqtt = (clientId: string, topic: string, msgReceiveCallback : (msg : string) => void, msgSendCallback : (msg : string) => void) => {
    if (client == null) {
        client = new Client(
            'ws://146.56.105.2:9001/mqtt',
            clientId
        );

        client.onConnectionLost = (response) => {
            if (response.errorCode !== 0) {
                console.log('connection Lost : ', response.errorMessage);
            }
        }

        client.onMessageArrived = (message) => {
            console.log(`MQTT Message Arrived : ${message.destinationName} : ${message.payloadString}`);
            msgReceiveCallback(message.payloadString);
        }

        client.onMessageDelivered = (message) => {
            console.log(`MQTT Message Delivered : , ${message.destinationName} : ${message.payloadString}`);
            msgSendCallback(message.payloadString);
        }

        client.connect({
            onSuccess: (success) => {
                console.log('MQTT Connected : ', success);
                client.subscribe(topic);
            },
            onFailure: (error) => {
                console.log('MQTT Connect Failed : ', error);
            },
            useSSL: false,
        });
    }
};

const sendMessage = (topic : string, payload: string) => {
    const message = new Message(payload);
    message.destinationName = topic;
    client.send(message);
}

const diconnect = () => {
    if (client != null) {
        client.disconnect();
    }
}

const setMessageCallback = () => {

}

export const MqttUtil = {
    initMqtt:       initMqtt,
    sendMessage:    sendMessage,
    diconnect:      diconnect
}
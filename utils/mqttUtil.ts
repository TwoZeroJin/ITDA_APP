import { Client, Message } from 'paho-mqtt';

let client: Client;

/**
 * mqtt 설정
 */
export const initMqtt = () => {
    client = new Client(
        'ws://146.56.105.2:9001/mqtt',
        'rn_' + Math.random.toString().substr(2, 8)
    );

    client.onConnectionLost = (response) => {
        if (response.errorCode !== 0) {
            console.log('connection Lost : ', response.errorMessage);
        }
    }

    client.onMessageArrived = (message) => {
        console.log(`MQTT Message Arrived : ${message.destinationName} : ${message.payloadString}`);
    }

    client.connect({
        onSuccess: () => {
            console.log('MQTT Connected');
            client.subscribe('chat/room1');
        },
        onFailure: () => {
            console.log('MQTT Connect Failed');
        },
        useSSL: false,
    });
};

export const sendMessage = (topic : string, payload: string) => {
    const message = new Message(payload);
    message.destinationName = topic;
    client.send(message);
}
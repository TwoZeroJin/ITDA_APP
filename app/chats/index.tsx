import CommHeader from '@/components/CommHeader';
import InputField from '@/components/InputField';
import { COLOR } from '@/constants';
import { useChatInsert } from '@/hooks/queries/useChat';
import { ChatData } from '@/types';
import { showToast } from '@/utils/commToast';
import { getAccessToken } from '@/utils/commUtil';
import { MqttUtil } from '@/utils/mqttUtil';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function IndexScreen() {
  const chatInsert = useChatInsert();
  const [chatMsg, setChatMsg] = useState("");
  const [chatMsgs, setChatMsgs] = useState<string[]>([]);
  const topic = "testTopic";
  const mqttUtil = MqttUtil;

  const msgReceiveCallback = (msg:string) => {
    console.log('msg : ', msg);
    setChatMsgs(prev => [...prev, msg]);
  }

  const msgSendCallback = (msg:string) => {
    console.log('msg : ', msg);
    setChatMsgs(prev => [...prev, msg]);
  }

  useEffect(() => {
    const fetchData = async () => {
      const accessTokon = await getAccessToken();
      if (accessTokon) {
        if (!mqttUtil.initMqtt(accessTokon, topic, msgReceiveCallback, msgSendCallback)) {
          showToast({
            text1: `채팅 연결에 실패하였습니다. 재시도해 주세요.`
          });
        router.back();
        }
      }
      else {
        // 연결 안될 경우 back
        showToast({
            text1: `회원 정보를 찾지 못하였습니다.`
        });
        router.back();
      }
    }

    fetchData();
  }, [])

  const handleSubmitChat = () => {
    const chatData : ChatData = {
      chat_id : 1,
      chat_type : "MEMBER",
      chat_msg  : chatMsg
    };

    // Mongo DB Insert
    chatInsert.mutate({...chatData});
    // MQTT SendMessage
    mqttUtil.sendMessage(topic, chatMsg);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CommHeader isLogo={false}/>
          <KeyboardAwareScrollView contentContainerStyle={styles.chatContainer}>
            {/* 채팅 메시지 목록 */}
            <View style={{borderColor: COLOR.COMM_RED, borderWidth: 10, width: '100%', height: '80%'}}>
              {chatMsgs.map((msg, idx) => (
                <Text key={idx}>{msg}</Text>
              ))}
            </View>
            <View style={[styles.inputContainer]}>
              <InputField
                  label="" 
                  placeholder='메시지를 입력하세요.'
                  inputMode='text'
                  autoCapitalize='none'
                  returnKeyType='send'
                  submitBehavior='newline'
                  keyboardType='default'
                  onSubmitEditing={handleSubmitChat}
                  value={chatMsg}
                  onChangeText={(msg) => setChatMsg(msg)}
              />
            </View>
          </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
  },
  chatContainer: {
    flex : 1,
  },
  inputContainer: {
    position            :"absolute",
    bottom              : 0,
    width               : "100%",
    paddingHorizontal   : 10
  }
});
import CommHeader from '@/components/CommHeader';
import InputField from '@/components/InputField';
import { COLOR } from '@/constants';
import { useChatInsert } from '@/hooks/queries/useChat';
import { ChatData } from '@/types';
import { initMqtt } from '@/utils/mqttUtil';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const chatInsert = useChatInsert();
  const [chatMsg, setChatMsg] = useState("");

  const mqttClient = initMqtt();
  
  useEffect(() => {
    const fetchData = async () => {
    }

    fetchData();
  }, [])

  const handleSubmitChat = () => {
    const chatData : ChatData = {
      chat_id : 1,
      chat_type : "MEMBER",
      chat_msg  : chatMsg
    };

    chatInsert.mutate({...chatData});
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <CommHeader isLogo={false}/>
          <KeyboardAwareScrollView contentContainerStyle={styles.chatContainer}>
            {/* 채팅 메시지 목록 */}
            <View style={{borderColor: COLOR.COMM_RED, borderWidth: 10, width: '100%', height: '80%'}}></View>
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
      </SafeAreaView>
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
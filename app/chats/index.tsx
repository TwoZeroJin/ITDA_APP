import CommHeader from '@/components/CommHeader';
import CustomDialog from '@/components/CustomDialog';
import { COLOR } from '@/constants';
import { useChatInsert, useChatListPaging } from '@/hooks/queries/useChat';
import { ChatData } from '@/types';
import { MqttUtil } from '@/utils/mqttUtil';
import * as commUtil from '@/utils/commUtil';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from 'react-native';

const formatTimeText = (sourceDate?: string) => {
  if (!sourceDate) {
    const now = new Date();
    return `오후 ${now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) {
    return sourceDate;
  }

  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  const period = hour >= 12 ? '오후' : '오전';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}:${minute}`;
};

const parseIncomingPayload = (raw: string): Partial<ChatData> => {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Partial<ChatData>;
    }
  }
  catch {
    // plain text payload
  }

  return { chat_msg: raw };
};

const getMessageText = (item: ChatData) => item.chat_msg || '';
const getSenderText = (item: ChatData) => item.mem_name || '상대방';

export default function IndexScreen() {
  const { room_id, room_name, room_type } = useLocalSearchParams<{ room_id: string; room_name: string; room_type: string }>();
  const chatInsert = useChatInsert();
  const { results, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatListPaging({
    page_no: 0,
    page_size: 20,
    room_id: room_id ,
  });
  const [chatMsg, setChatMsg] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState<ChatData[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [myMemId, setMyMemId] = useState<number>(0);
  const topic = room_id ?? "testTopic";
  const mqttUtil = MqttUtil;
  const flatListRef = useRef<FlatList<ChatData>>(null);
  const hasScrolledInitial = useRef(false);
  const topLoadReadyRef = useRef(true);

  const chat_id = Number(room_id.substring(room_id.lastIndexOf("_") + 1));
  const chat_type: ChatData['chat_type'] = room_type === "MEET" ? 'MEET' : room_type === 'GROUP' ? 'GROUP' : 'MEMBER';

  // 내 mem_id 정보 조회
  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await commUtil.getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
    };

    fetchMyMemberInfo();
  }, []);

  const messages = useMemo(() => {
    return [...realtimeMessages, ...(results ?? [])];
  }, [results, realtimeMessages]);

  useEffect(() => {
    if (!messages.length || hasScrolledInitial.current) {
      return;
    }

  }, [messages.length]);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

  }, [realtimeMessages.length]);

  const msgReceiveCallback = (msg:string) => {
    const payload = parseIncomingPayload(msg);

    if (payload.sender_id && Number(payload.sender_id) === myMemId) {
      // 내 메시지는 이미 실시간으로 반영되어 있으므로 별도 처리하지 않음
      return;
    }
    setRealtimeMessages((prev) => [
      {
        chat_id: payload.chat_id ?? Date.now(),
        chat_type: payload.chat_type ?? 'MEET',
        chat_msg: payload.chat_msg ?? msg,
        room_id: payload.room_id ?? room_id,
        mem_name: payload.mem_name,
        reg_sdate: payload.reg_sdate,
      },
      ...prev,
    ]);
  }

  // MQTT 메시지 발송 콜백 (현재는 별도 처리 없이 로그만 출력)
  const msgSendCallback = () => {}

  // MQTT 연결 및 메시지 수신 설정
  useEffect(() => {
    const fetchData = async () => {
      if (await mqttUtil.initMqtt(topic, msgReceiveCallback, msgSendCallback)) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }

    fetchData();

    return () => {
      mqttUtil.disconnect();
    };
  }, [topic])

  // 메시지 전송 핸들러
  const handleSubmitChat = () => {
    const trimMsg = chatMsg.trim();
    if (!trimMsg) {
      return;
    }

    const nowIso = new Date().toISOString();

    const chatData : ChatData = {
      chat_id   : chat_id,
      chat_type : chat_type,
      chat_msg  : trimMsg,
      room_id   : room_id,
    };

    setRealtimeMessages((prev) => [
      {
        ...chatData,
        sender_id: myMemId,
        reg_sdate: nowIso,
      },
      ...prev,
    ]);

    setChatMsg('');

    // Mongo DB Insert
    chatInsert.mutate({...chatData});
    // MQTT SendMessage
    mqttUtil.sendMessage(topic, {...chatData, sender_id: myMemId, reg_sdate: nowIso});
  }

  const renderMessage = ({ item }: { item: ChatData }) => {
    const isMine = Number(item.sender_id) === myMemId;

    if (isMine) {
      return (
        <View style={styles.myMessageWrap}>
          <Text style={styles.timeText}>{formatTimeText(item.reg_sdate)}</Text>
          <View style={[styles.bubble, styles.myBubble]}>
            <Text style={styles.myBubbleText}>{getMessageText(item)}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.otherMessageWrap}>
        <View style={[styles.avatar, { backgroundColor: '#1E88E5' }]} />
        <View style={styles.otherMessageContent}>
          <Text style={styles.senderText}>{getSenderText(item)}</Text>
          <View style={[styles.bubble, styles.otherBubble]}>
            <Text style={styles.otherBubbleText}>{getMessageText(item)}</Text>
          </View>
          <Text style={styles.timeText}>{formatTimeText(item.reg_sdate)}</Text>
        </View>
      </View>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > 100) {
      topLoadReadyRef.current = true;
    }

    if (offsetY <= 40 && topLoadReadyRef.current && hasNextPage && !isFetchingNextPage) {
      topLoadReadyRef.current = false;
      fetchNextPage();
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 16}
      >
        <View style={styles.container}>
          <CommHeader isLike={false} isNoti={false} isLogo={false} isDetail={true} title={room_name ?? "채팅"}/>

          <View style={styles.meetInfoWrap}>
            <Text style={styles.meetInfoText}>📅 한성교회 · 1.7(수) · 오후 8:30</Text>
          </View>

          <View style={styles.dateBadgeWrap}>
            <Text style={styles.dateBadgeText}>2026년 1월 3일 토요일</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            keyExtractor={(item, index) => `${item.chat_id}-${index}`}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListHeaderComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={styles.topLoading} />
              ) : null
            }
          />

          <View style={styles.inputBarWrap}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>＋</Text>
            </TouchableOpacity>

            <View style={styles.inputBoxWrap}>
              <TextInput
                value={chatMsg}
                onChangeText={setChatMsg}
                placeholder="메시지 입력"
                placeholderTextColor={COLOR.TEXT_GRAY}
                style={styles.inputBox}
                returnKeyType="send"
                onSubmitEditing={handleSubmitChat}
              />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSubmitChat}>
              <Text style={styles.sendButtonText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <CustomDialog
        visible={!isConnected}
        title="연결 실패"
        content="채팅서버에 연결하지 못하였습니다."
        cancelLabel="뒤로"
        confirmLabel="재시도"
        onCancel={() => { router.back(); }}
        onConfirm={() => mqttUtil.initMqtt(topic, msgReceiveCallback, msgSendCallback)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  meetInfoWrap: {
    marginHorizontal: 20,
    backgroundColor: COLOR.COMM_GRAY_5,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  meetInfoText: {
    color: COLOR.TEXT_2F2F2F,
    fontSize: 18,
    fontWeight: '600',
  },
  dateBadgeWrap: {
    marginTop: 12,
    alignItems: 'center',
  },
  dateBadgeText: {
    backgroundColor: COLOR.COMM_GRAY_5,
    borderRadius: 14,
    color: COLOR.TEXT_GRAY,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  messageListContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 8,
  },
  otherMessageWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    marginTop: 4,
  },
  otherMessageContent: {
    maxWidth: '80%',
  },
  senderText: {
    color: COLOR.TEXT_2F2F2F,
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '500',
  },
  myMessageWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bubble: {
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  otherBubble: {
    backgroundColor: COLOR.COMM_GRAY_5,
    alignSelf: 'flex-start',
  },
  myBubble: {
    backgroundColor: COLOR.APP_MAIN,
    alignSelf: 'flex-end',
  },
  otherBubbleText: {
    color: COLOR.TEXT_2F2F2F,
    fontSize: 17,
    lineHeight: 23,
  },
  myBubbleText: {
    color: COLOR.COMM_WHITE,
    fontSize: 17,
    lineHeight: 23,
  },
  timeText: {
    color: COLOR.TEXT_GRAY,
    fontSize: 12,
    marginTop: 6,
    marginHorizontal: 6,
  },
  inputBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: COLOR.COMM_GRAY_4,
    gap: 10,
    backgroundColor: COLOR.COMM_WHITE,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.COMM_GRAY_4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLOR.TEXT_DEFAULT,
    fontSize: 24,
    lineHeight: 24,
  },
  inputBoxWrap: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: COLOR.COMM_GRAY_5,
    paddingHorizontal: 14,
    justifyContent: 'center',
    height: 46,
  },
  inputBox: {
    color: COLOR.TEXT_2F2F2F,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.APP_ACTIVE_5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: COLOR.COMM_WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  topLoading: {
    marginVertical: 10,
  }
});
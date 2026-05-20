import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import { COLOR, QUERY_KEYS } from '@/constants';
import { useChatInsert, useChatListPaging } from '@/hooks/queries/useChat';
import { ChatData } from '@/types';
import { MqttUtil } from '@/utils/mqttUtil';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { getMemberInfo, parseChatPayload } from '@/utils/commUtil';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

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

const getDateGroupKey = (sourceDate?: string) => {
  if (!sourceDate) {
    return '';
  }

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatDateBadgeText = (sourceDate?: string) => {
  if (!sourceDate) {
    return '';
  }

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayNames[date.getDay()]}`;
};

const getMessageText = (item: ChatData) => item.chat_msg || '';
const getSenderText = (item: ChatData) => item.mem_name || '상대방';

export default function IndexScreen() {
  const { room_id, room_name, room_type } = useLocalSearchParams<{ room_id: string; room_name: string; room_type: string }>();
  const chatInsert = useChatInsert();
  const { results, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatListPaging({
    page_no: 0,
    page_size: 20,
    room_id: room_id ,
  });
  const [chatMsg, setChatMsg] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState<ChatData[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [myMemId, setMyMemId] = useState<number>(0);
  const myMemIdRef = useRef<number>(0);
  const topic = room_id;
  const mqttUtil = MqttUtil;
  const flatListRef = useRef<FlatList<ChatData>>(null);
  const hasUserDraggedRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const chat_id = Number(room_id.substring(room_id.lastIndexOf("_") + 1));
  const chat_type: ChatData['chat_type'] = room_type === "MEET" ? 'MEET' : room_type === 'GROUP' ? 'GROUP' : 'MEMBER';

  // 내 mem_id 정보 조회
  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
      myMemIdRef.current = memberInfo.mem_id ?? 0;
    };

    fetchMyMemberInfo();
  }, []);

  useEffect(() => {
    myMemIdRef.current = myMemId;
  }, [myMemId]);

  const messages = useMemo(() => {
    return [...realtimeMessages, ...(results ?? [])];
  }, [results, realtimeMessages]);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

  }, [realtimeMessages.length]);

  // 채팅 메시지 맨위로 올릴 경우 추가 데이터 로드
  const handleEndReached = () => {
    if (!hasUserDraggedRef.current) {
      return;
    }
    if (onEndReachedCalledDuringMomentum.current) {
      return;
    }
    if (hasNextPage && !isFetchingNextPage) {
      onEndReachedCalledDuringMomentum.current = true;
      fetchNextPage();
    }
  };

  const msgReceiveCallback = (msg:string) => {
    const payload = parseChatPayload(msg);
    const currentMyMemId = myMemIdRef.current;

    if (payload.sender_id && Number(payload.sender_id) === currentMyMemId) {
      // 내 메시지는 이미 실시간으로 반영되어 있으므로 별도 처리하지 않음
      return;
    }

    setRealtimeMessages((prev) => [
      {
        chat_id     : payload.chat_id ?? Date.now(),
        chat_type   : payload.chat_type ?? 'MEET',
        chat_msg    : payload.chat_msg ?? msg,
        room_id     : payload.room_id ?? room_id,
        sender_id   : payload.sender_id ? Number(payload.sender_id) : undefined,
        mem_name    : payload.mem_name,
        send_date   : payload.send_date || new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  // MQTT 메시지 발송 콜백 (현재는 별도 처리 없음)
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
      chat_id     : chat_id,
      chat_type   : chat_type,
      chat_msg    : trimMsg,
      room_id     : room_id,
      send_date  : nowIso,
    };

    setRealtimeMessages((prev) => [
      {
        ...chatData,
        sender_id: myMemId,
      },
      ...prev,
    ]);

    setChatMsg('');

    // Mongo DB Insert
    chatInsert.mutate({...chatData});
    // MQTT SendMessage
    mqttUtil.sendMessage(topic, {...chatData, sender_id: myMemId, send_sdate: nowIso});
  }

  const renderMessage = ({ item, index }: { item: ChatData; index: number }) => {
    // 이전 메시지와 날짜가 다르면 날짜 배지 표시
    const prevItem = index > 0 ? messages[index - 1] : undefined;
    const shouldShowDateBadge = index === 0 || getDateGroupKey(item.send_date) !== getDateGroupKey(prevItem?.send_date);
    const dateBadgeText = formatDateBadgeText(prevItem?.send_date);
    
    const isMine = Number(item.sender_id) === myMemId; // 내 메시지 여부
    // 메시지 표시
    const messageContent = isMine ? (
      <View style={styles.myMessageWrap}>
        <Text style={styles.timeText}>{formatTimeText(item.send_date)}</Text>
        <View style={[styles.bubble, styles.myBubble]}>
          <Text style={styles.myBubbleText}>{getMessageText(item)}</Text>
        </View>
      </View>
    ) : (
      <View style={styles.otherMessageWrap}>
        <View style={[styles.avatar, { backgroundColor: '#1E88E5' }]} />
        <View style={styles.otherMessageContent}>
          <Text style={styles.senderText}>{getSenderText(item)}</Text>
          <View style={[styles.bubble, styles.otherBubble]}>
            <Text style={styles.otherBubbleText}>{getMessageText(item)}</Text>
          </View>
          <Text style={styles.timeText}>{formatTimeText(item.send_date)}</Text>
        </View>
      </View>
    );
    
    return (
      <>
        {/* 날짜 배지 표시 */}
        {shouldShowDateBadge && !!dateBadgeText && (
          <View style={styles.dateBadgeWrap}>
            <Text style={styles.dateBadgeText}>{dateBadgeText}</Text>
          </View>
        )}
        {messageContent}
      </>
    );
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

          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            keyExtractor={(item, index) => `${item.chat_id}-${index}`}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={() => {
              hasUserDraggedRef.current = true;
            }}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            ListHeaderComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={styles.topLoading} />
              ) : null
            }
          />

          <View style={styles.inputBarWrap}>
            <TouchableOpacity 
              style={styles.addButton}
              activeOpacity={0.6}
            >
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

            <TouchableOpacity 
              style={styles.sendButton} 
              activeOpacity={0.6}
              onPress={handleSubmitChat}
            >
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
    flex              : 1,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  meetInfoWrap: {
    alignItems        : 'center',
    marginTop         : 8,
    marginHorizontal  : 20,
    backgroundColor   : COLOR.COMM_GRAY_5,
    borderRadius      : 10,
    paddingVertical   : 10,
  },
  meetInfoText: {
    fontWeight        : 'bold',
    color             : COLOR.TEXT_2F2F2F,
    fontSize          : 18,
  },
  dateBadgeWrap: {
    alignItems        : 'center',
    marginTop         : 12,
  },
  dateBadgeText: {
    backgroundColor   : COLOR.COMM_GRAY_5,
    borderRadius      : 14,
    color             : COLOR.TEXT_GRAY,
    fontSize          : 15,
    paddingHorizontal : 12,
    paddingVertical   : 6,
  },
  messageListContent: {
    justifyContent    : 'flex-end',
    flexGrow          : 1,
    paddingTop        : 18,
    paddingHorizontal : 18,
    paddingBottom     : 10,
    gap               : 8,
  },
  otherMessageWrap: {
    flexDirection     : 'row',
    alignItems        : 'flex-start',
    marginBottom      : 8,
  },
  avatar: {
    width             : 28,
    height            : 28,
    borderRadius      : 14,
    marginRight       : 10,
    marginTop         : 4,
  },
  otherMessageContent: {
    maxWidth          : '80%',
  },
  senderText: {
    color             : COLOR.TEXT_2F2F2F,
    fontSize          : 15,
    marginBottom      : 4,
    fontWeight        : '500',
  },
  myMessageWrap: {
    flexDirection     : 'row',
    justifyContent    : 'flex-end',
    alignItems        : 'flex-end',
    marginBottom      : 8,
  },
  bubble: {
    borderRadius      : 22,
    paddingHorizontal : 14,
    paddingVertical   : 11,
  },
  otherBubble: {
    alignSelf         : 'flex-start',
    backgroundColor   : COLOR.COMM_GRAY_5,
  },
  myBubble: {
    alignSelf         : 'flex-end',
    backgroundColor   : COLOR.APP_MAIN,
  },
  otherBubbleText: {
    color             : COLOR.TEXT_2F2F2F,
    fontSize          : 17,
    lineHeight        : 23,
  },
  myBubbleText: {
    color             : COLOR.COMM_WHITE,
    fontSize          : 17,
    lineHeight        : 23,
  },
  timeText: {
    color             : COLOR.TEXT_GRAY,
    fontSize          : 12,
    marginTop         : 6,
    marginHorizontal  : 6,
  },
  inputBarWrap: {
    flexDirection     : 'row',
    alignItems        : 'center',
    paddingHorizontal : 14,
    paddingTop        : 10,
    paddingBottom     : 18,
    borderTopWidth    : 1,
    borderTopColor    : COLOR.COMM_GRAY_4,
    gap               : 10,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  addButton: {
    width             : 36,
    height            : 36,
    borderRadius      : 18,
    backgroundColor   : COLOR.COMM_GRAY_4,
    alignItems        : 'center',
    justifyContent    : 'center',
  },
  addButtonText: {
    color             : COLOR.TEXT_DEFAULT,
    fontSize          : 24,
    lineHeight        : 24,
  },
  inputBoxWrap: {
    flex              : 1,
    borderRadius      : 16,
    backgroundColor   : COLOR.COMM_GRAY_5,
    paddingHorizontal : 14,
    justifyContent    : 'center',
    height            : 46,
  },
  inputBox: {
    color             : COLOR.TEXT_2F2F2F,
    fontSize          : 16,
  },
  sendButton: {
    width             : 36,
    height            : 36,
    borderRadius      : 18,
    backgroundColor   : COLOR.APP_ACTIVE_5,
    alignItems        : 'center',
    justifyContent    : 'center',
  },
  sendButtonText: {
    color             : COLOR.COMM_WHITE,
    fontSize          : 18,
    fontWeight        : '700',
  },
  topLoading: {
    marginVertical    : 10,
  }
});
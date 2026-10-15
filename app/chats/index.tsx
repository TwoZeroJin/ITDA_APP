import CommHeader from '@/components/comm/CommHeader';
import CustomDialog from '@/components/modal/CustomDialog';
import ImagePreviewModal from '@/components/modal/ImagePreviewModal';
import { COLOR, COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import { useChatDelete, useChatExit, useChatInsert, useChatListPaging, useChatMemberList } from '@/hooks/queries/useChat';
import { ChatData } from '@/types';
import { MqttUtil } from '@/utils/mqttUtil';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { getMemberInfo, isImageMessage, parseChatPayload, renderTextWithHttpLinks } from '@/utils/commUtil';
import IconChatSend from '@/assets/images/icon_chat_send.svg';
import IconChatAdd from '@/assets/images/icon_chat_add.svg';
import DropdownModal from '@/components/modal/DropdownModal';
import ProfileIcon from '@/components/ProfileIcon';
import CommBottomButton from '@/components/comm/CommBottomButton';
import { showToast } from '@/utils/commToast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImagePickerUpload } from '@/hooks/useImagePickerUpload';

/**
 * 채팅 화면
 */
export default function IndexScreen() {
  const NEAR_LATEST_OFFSET = 40;
  const { room_id, room_name, room_type, expiry_date, mem_id } = useLocalSearchParams<{ room_id: string; room_name: string; room_type: string, expiry_date: string, mem_id: string }>();
  const chatInsert = useChatInsert();
  const chatExit = useChatExit();
  const chatDelete = useChatDelete();
  const { results: chatMemberList } = useChatMemberList({room_id : room_id});
  const { results, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatListPaging({
    page_no: 0,
    page_size: 20,
    room_id: room_id,
  });
  const [chatMsg, setChatMsg] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState<ChatData[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [myMemId, setMyMemId] = useState<number>(0);
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const [expiryYn, setExpiryYn] = useState('N');
  const [isExit, setIsExit] = useState(false);
  const [showNewMessageNotice, setShowNewMessageNotice] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [pendingImage, setPendingImage] = useState<{ uri: string; filePath: string } | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [topic] = useState<string>(room_id ? room_id : `${COMM_CONSTANTS.COMM_MEMBER}_${Number(mem_id) < myMemId ? `${mem_id}_${myMemId}` : `${myMemId}_${mem_id}`}`);
  const msgInputRef = useRef<TextInput>(null);
  const mqttUtil = MqttUtil;
  const subscriberIdRef = useRef(`chat-screen:${Date.now()}:${room_id}`);
  const flatListRef = useRef<FlatList<ChatData>>(null);
  const isNearLatestRef = useRef(true);
  const hasUserDraggedRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(true);
  const hasFocusedOnceRef = useRef(false);
  const chat_id = (() => {
    if (!room_id) return Number(mem_id);
    if (!room_type.includes('MEMBER')) return Number(room_id.split("_")[1]);
    const ids = room_id.split("_").slice(1).map(Number);
    return ids.find((id) => id !== myMemId) ?? Number(mem_id);
  })();
  const chat_type = room_type;
  const insets = useSafeAreaInsets();

  // 화면 포커스시 재조회
  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }
      refetch();
    }, [refetch]),
  );

  // 내 mem_id 정보 조회 및 만료 여부
  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);

      if (expiry_date) {
        const now = new Date().toISOString().slice(0, 10);
        if (expiry_date < now) {
          setExpiryYn('Y');
        }
      }
    };

    fetchMyMemberInfo();
  }, []);

  // 메시지 메모리 관리
  const messages = useMemo(() => {
    const mergedMessages = [...realtimeMessages, ...(results ?? [])];

    return mergedMessages.map((message) => {
      const senderInfo = chatMemberList.find((member) => Number(member.mem_id) === Number(message.sender_id));

      if (!senderInfo) {
        return {
          ...message,
          sender_id       : 0,
          mem_nick        : '(알 수 없음)',
          mem_image_url   : '',
        };
      }

      return {
        ...message,
        mem_nick     : senderInfo.mem_nick || senderInfo.mem_name || message.mem_nick,
        mem_image_url: senderInfo.mem_image_url || message.mem_image_url,
      };
    });
  }, [realtimeMessages, results, chatMemberList]);

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

  const msgReceiveCallback = useCallback((msg: string) => {
    const payload = parseChatPayload(msg);
    const senderId = payload.sender_id ? Number(payload.sender_id) : undefined;
    const senderInfo = chatMemberList.find((member) => Number(member.mem_id) === senderId);

    if (senderId && senderId === myMemId) {
      // 내 메시지는 이미 실시간으로 반영되어 있으므로 별도 처리하지 않음
      return;
    }

    setRealtimeMessages((prev) => [
      {
        chat_id      : payload.chat_id ?? Date.now(),
        chat_type    : payload.chat_type ?? 'MEET',
        chat_msg     : payload.chat_msg ?? msg,
        room_id      : payload.room_id ?? room_id,
        sender_id    : senderId,
        mem_nick     : senderInfo?.mem_nick || senderInfo?.mem_name || payload.mem_nick,
        mem_image_url: senderInfo?.mem_image_url,
        send_date    : payload.send_date || new Date().toISOString(),
      },
      ...prev,
    ]);

    if (!isNearLatestRef.current) {
      setShowNewMessageNotice(true);
      setNewMessageCount((prev) => prev + 1);
    }
  }, [chatMemberList, myMemId, room_id]);

  const moveToLatestMessage = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowNewMessageNotice(false);
    setNewMessageCount(0);
  }, []);

  // MQTT 연결 및 메시지 수신 설정
  useEffect(() => {
    if (!topic || !myMemId) {
      return;
    }

    const subscriberId = subscriberIdRef.current;
    let isMounted = true;

    const fetchData = async () => {
      const isSubscribed = await mqttUtil.subscribe(topic, subscriberId, msgReceiveCallback);

      if (isMounted) {
        setIsConnected(isSubscribed);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      mqttUtil.unsubscribe(topic, subscriberId);
    };
  }, [topic, myMemId, msgReceiveCallback]);

  // 채팅방 나가기 처리
  useEffect(() => {
    return () => {
      chatExit.mutate({ room_id } as any);
    };
  }, []);

  // 채팅방 삭제 처리
  const handleDeleteChatRoom = () => {
    chatDelete.mutate({ room_id } as any, {
      onSuccess: () => {
        showToast({ text1: '채팅방에서 나갔습니다.' });
        router.back();
      },
      onError: () => {
        showToast({ text1: '채팅방에서 나가기가 실패하였습니다.' });
      }
    });
  };

  const sendChatMessage = (message: string) => {
    if (!message.trim()) {
      return;
    }

    const nowIso = new Date().toISOString();

    const chatData : ChatData = {
      chat_id     : chat_id,
      chat_type   : chat_type,
      chat_msg    : message.trim(),
      room_id     : room_id,
      sender_id   : myMemId,
      send_date   : nowIso,
    };

    setChatMsg('');
    setPendingImage(null);

    // Mongo DB Insert
    chatInsert.mutate(
      {...chatData},
      {
        onSuccess: (result) => {
          // API 통신 후 mqtt 메시지 전송 및 실시간 메시지 업데이트
          const sentChatData = {
            ...chatData,
            chat_msg: result.data ?? chatData.chat_msg,
          };
          mqttUtil.sendMessage(topic, sentChatData);
          setRealtimeMessages((prev) => [
            {
              ...sentChatData,
            },
            ...prev,
          ]);
        },
      }
    );

    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  // 메시지 전송 핸들러
  const handleSubmitChat = () => {
    const trimMsg = chatMsg.trim();
    if (pendingImage) {
      sendChatMessage(pendingImage.filePath);
      return;
    }
    sendChatMessage(trimMsg);
  };

  const { open: handleOpenChatImagePicker } = useImagePickerUpload({
    onSuccess: (files) => {
      const imagePath = files[0]?.file_path;
      if (imagePath) {
        setPendingImage(null);
        sendChatMessage(imagePath);
      }
    },
  });

  const formatDateBadgeText = (sourceDate?: string) => {
  if (!sourceDate) {
    return '';
  }
  const date = new Date(sourceDate);
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayNames[date.getDay()]}`;
  };
  const formatTimeText = (sourceDate?: string) => {
    if (!sourceDate) {
      return '';
    }
    const date = new Date(sourceDate);
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const getSenderText = (item: ChatData) => item.mem_nick;
  const renderChatMessage = (message: string, textStyle: object) => (
    isImageMessage(message)
      ? <Image source={{ uri: message }} style={styles.chatImage} />
      : <Text style={textStyle}>{renderTextWithHttpLinks(message)}</Text>
  );

  const handleMessagePress = (message: string) => {
    if (isImageMessage(message)) {
      setPreviewImageUri(message);
      return;
    }

    Alert.alert('메시지', undefined, [
      {
        text: '복사하기',
        onPress: () => {
          void Clipboard.setStringAsync(message);
          showToast({ text1: '메시지를 복사했습니다.' });
        },
      },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const DETAIL_MENU_ITEMS = [
    {
      label: chat_type === COMM_CONSTANTS.COMM_MEET ? '소셜링 정보' : '클럽 정보',
      onPress: () => {
        router.push({
          pathname: chat_type === COMM_CONSTANTS.COMM_MEET ? `/meets/detailView` : `/groups/detailView`,
          params: chat_type === COMM_CONSTANTS.COMM_MEET ?
            { meetId: chat_id } : { groupId: chat_id },
        });
      },
    },
    {
      label: '멤버 목록',
      onPress: () => {
        router.navigate({
          pathname: '/members/memberList',
          params: {
            target_id: chat_id,
            target_type: chat_type === COMM_CONSTANTS.COMM_MEET ? 'M' : 'G',
          }
        });
      }
    },
  ];

  // 채팅 메시지 렌더링
  const renderMessage = ({ item, index }: { item: ChatData; index: number }) => {
    const prevItem = index > 0 ? messages[index - 1] : undefined;
    const nextItem = index < messages.length - 1 ? messages[index + 1] : undefined;
    // 이전 메시지와 날짜가 다르면 날짜 배지 표시
    const shouldShowDateBadge = getDateGroupKey(item.send_date) !== getDateGroupKey(prevItem?.send_date);
    const dateBadgeText = formatDateBadgeText(prevItem?.send_date);
    // 보내는 사람이 같은 경우는 nextItem과 비교, 보낸 날짜는 prevItem과 비교하여 렌더링 여부 결정
    const isSameSender = Number(nextItem?.sender_id) === Number(item.sender_id);
    const isSameDateTime = formatTimeText(prevItem?.send_date) === formatTimeText(item.send_date);
    
    const isMine = Number(item.sender_id) === myMemId; // 내 메시지 여부
    // 메시지 표시
    const messageContent = isMine ? (
      <View style={styles.myMessageWrap}>
        {!isSameDateTime && <Text style={styles.timeText}>{formatTimeText(item.send_date)}</Text>}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => isImageMessage(item.chat_msg) && handleMessagePress(item.chat_msg)}
          onLongPress={() => handleMessagePress(item.chat_msg)}
          delayLongPress={350}
          style={[styles.bubble, styles.myBubble]}
        >
          {renderChatMessage(item.chat_msg, [styles.otherBubbleText, styles.myBubbleText])}
        </TouchableOpacity>
      </View>
    ) : (
      !isSameSender ? (
        // 보낸 사람이 다르면 아바타와 함께 표시
        <View style={styles.otherMessageWrap}>
          <ProfileIcon
            type="MEMBER"
            mem_id={item.sender_id}
            mem_image_url={item.mem_image_url}
            containerStyle={{ marginEnd: 8 }}
            room_id={room_id}
          />
          <View>
            <Text style={styles.senderText}>{getSenderText(item)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => isImageMessage(item.chat_msg) && handleMessagePress(item.chat_msg)}
                onLongPress={() => handleMessagePress(item.chat_msg)}
                delayLongPress={350}
                style={[styles.bubble, styles.otherBubble]}
              >
                {renderChatMessage(item.chat_msg, styles.otherBubbleText)}
              </TouchableOpacity>
              {!isSameDateTime && <Text style={styles.timeText}>{formatTimeText(item.send_date)}</Text>}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.otherMessageOnlyWrap}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => isImageMessage(item.chat_msg) && handleMessagePress(item.chat_msg)}
            onLongPress={() => handleMessagePress(item.chat_msg)}
            delayLongPress={350}
            style={[styles.bubble, styles.otherBubble]}
          >
            {renderChatMessage(item.chat_msg, styles.otherBubbleText)}
          </TouchableOpacity>
          {!isSameDateTime && <Text style={styles.timeText}>{formatTimeText(item.send_date)}</Text>}
        </View>
      )
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
        // behavior={os === 'ios' ? 'padding' : 'height'}
        behavior='padding'
        // keyboardVerticalOffset={os === 'ios' ? 45 : 0}
        keyboardVerticalOffset={insets.top}
      >
        <View style={[styles.container, expiryYn === 'Y' && { paddingBottom: 100 }]}>
          <CommHeader 
            isLike={false} 
            isNoti={false} 
            isLogo={false} 
            isDetail={chat_type !== COMM_CONSTANTS.COMM_MEMBER} 
            title={room_name}
            onPressDetail={() => setIsDetailMenuVisible((prev) => !prev)}
          />

          {isDetailMenuVisible && (
            <TouchableOpacity
              style={COMM_STYLES.detailMenuBackdrop}
              activeOpacity={1}
              onPress={() => setIsDetailMenuVisible(false)}
            />
          )}
    
          {isDetailMenuVisible && (
            <View style={COMM_STYLES.detailMenuLayer} pointerEvents="box-none">
              <View style={COMM_STYLES.detailMenuAnchor}>
                <DropdownModal
                  items={DETAIL_MENU_ITEMS}
                  position="right"
                  visible={isDetailMenuVisible}
                  onVisibleChange={setIsDetailMenuVisible}
                />
              </View>
            </View>
          )}

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
            onScroll={({ nativeEvent }) => {
              const isNearLatest = nativeEvent.contentOffset.y <= NEAR_LATEST_OFFSET;
              isNearLatestRef.current = isNearLatest;

              if (isNearLatest && showNewMessageNotice) {
                setShowNewMessageNotice(false);
                setNewMessageCount(0);
              }
            }}
            scrollEventThrottle={16}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            ListHeaderComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={styles.topLoading} />
              ) : null
            }
          />

          {showNewMessageNotice && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.newMessageNoticeButton}
              onPress={moveToLatestMessage}
            >
              <Text style={styles.newMessageNoticeText}>
                {`새 메시지 ${newMessageCount}개`}
              </Text>
            </TouchableOpacity>
          )}

          {expiryYn === 'N' ? (
            <View style={styles.inputBarWrap}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleOpenChatImagePicker}
              >
                <IconChatAdd width={30} height={30} />
              </TouchableOpacity>
              {pendingImage && <Image source={{ uri: pendingImage.uri }} style={styles.pendingImagePreview} />}
              <TouchableOpacity 
                style={styles.inputBoxWrap}
                activeOpacity={0.6}
                onPress={() => { msgInputRef.current?.focus();}}
              >
                <TextInput
                  ref={msgInputRef}
                  value={chatMsg}
                  onChangeText={setChatMsg}
                  placeholder="메시지 입력"
                  placeholderTextColor={COLOR.COMM_GRAY_7}
                  style={styles.inputBox}
                  returnKeyType="default"
                  onSubmitEditing={handleSubmitChat}
                  multiline={true}
                  maxLength={500}
                />
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.6}
                onPress={handleSubmitChat}
                style={{ marginStart: -5, marginEnd: -10, paddingEnd : 10, paddingVertical: 20, zIndex: 10 }}
                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              >
                <IconChatSend width={30} height={30} />
              </TouchableOpacity>
            </View>
          ) : 
            <CommBottomButton 
              label="채팅방 나가기" 
              onPress={() => setIsExit(true)}
            />
          }
        </View>
      </KeyboardAvoidingView>

      <ImagePreviewModal
        visible={Boolean(previewImageUri)}
        images={previewImageUri ? [previewImageUri] : []}
        initialIndex={0}
        onClose={() => setPreviewImageUri(null)}
      />
      
      <CustomDialog
        visible={!isConnected}
        title="연결 실패"
        content="채팅서버에 연결하지 못하였습니다."
        cancelLabel="뒤로"
        confirmLabel="재시도"
        onCancel={() => { router.back(); }}
        onConfirm={async () => {
          if (!topic || !myMemId) {
            return;
          }
          const isSubscribed = await mqttUtil.subscribe(topic, subscriberIdRef.current, (msg) => {
            msgReceiveCallback(msg);
          });
          setIsConnected(isSubscribed);
        }}
      />

      <CustomDialog
        visible={isExit}
        title="채팅방 나가기"
        content={`모임이 끝난 채팅방입니다. 채팅방을 나가시겠습니까?`}
        cancelLabel="닫기"
        confirmLabel="나가기"
        onCancel={() => setIsExit(false)}
        onConfirm={handleDeleteChatRoom}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container : {
    flex              : 1,
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
    gap               : 10,
  },
  otherMessageWrap: {
    flexDirection     : 'row',
    alignItems        : 'flex-start',
  },
  otherMessageOnlyWrap: {
    flexDirection     : 'row',
    alignItems        : 'flex-end',
    marginStart       : 48,
  },
  senderText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
    marginBottom      : 8,
  },
  myMessageWrap: {
    flexDirection     : 'row',
    justifyContent    : 'flex-end',
    alignItems        : 'flex-end',
  },
  bubble: {
    borderRadius      : 14,
    paddingHorizontal : 11,
    paddingVertical   : 6,
  },
  otherBubble: {
    alignSelf         : 'flex-start',
    backgroundColor   : COLOR.COMM_GRAY_5,
  },
  myBubble: {
    alignSelf         : 'flex-end',
    backgroundColor   : COLOR.APP_ACTIVE_4,
  },
  otherBubbleText: {
    fontSize          : 16,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
    lineHeight        : 23,
    maxWidth          : 180,
  },
  chatImage: {
    width             : 180,
    height            : 180,
    borderRadius      : 12,
  },
  myBubbleText: {
    color             : COLOR.COMM_WHITE,
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
    width             : '100%',
    height            : 80,
    paddingHorizontal : 16,
    paddingTop        : 16,
    paddingBottom     : 18,
    borderTopWidth    : 1,
    borderTopColor    : COLOR.COMM_GRAY_4,
    gap               : 10,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  inputBoxWrap: {
    flex              : 1,
    borderRadius      : 16,
    backgroundColor   : COLOR.COMM_GRAY_5,
    paddingHorizontal : 14,
    paddingVertical   : 5,
    justifyContent    : 'center',
    height            : 50,
  },
  inputBox: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_2F2F2F,
    paddingVertical   : 0,
  },
  pendingImagePreview: {
    width             : 44,
    height            : 44,
    borderRadius      : 8,
    marginStart       : 4,
  },
  topLoading: {
    marginVertical    : 10,
  },
  newMessageNoticeButton: {
    position          : 'absolute',
    bottom            : 92,
    alignSelf         : 'center',
    backgroundColor   : COLOR.APP_ACTIVE_1,
    borderRadius      : 18,
    paddingHorizontal : 14,
    paddingVertical   : 8,
    zIndex            : 20,
  },
  newMessageNoticeText: {
    color             : COLOR.COMM_WHITE,
    fontSize          : 13,
    fontFamily        : 'Pretendard-Medium',
  },
});
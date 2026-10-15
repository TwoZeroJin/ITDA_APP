import CommHeader from "@/components/comm/CommHeader";
import { COLOR, COMM_CONSTANTS, COMM_STYLES } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { useChatRoomListPaging } from "@/hooks/queries/useChat";
import { RoomData } from "@/types";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CategoryTab } from "@/components/CategoryTab";
import ImageDefault from "@/assets/images/no_image.svg";
import { formatRelativeTime, getMemberInfo, isImageMessage, parseChatPayload } from "@/utils/commUtil";
import { MqttUtil } from "@/utils/mqttUtil";

/**
 * 채팅 리스트 화면
 */
export default function ChatListScreen() {
  const router = useAuthRouter();
  const hasHandledInitialLoadingRef = useRef(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [myMemId, setMyMemId] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chatRooms, setChatRooms] = useState<RoomData[]>([]);
  const { setLoading } = useLoading();
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatRoomListPaging({
    page_no   : 0,
    page_size : 20
  });

  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      if (memberInfo) {
        MqttUtil.subscribeTopicList(memberInfo.topic_list ?? [], 'ChatListScreen', (msg, topic) => {
          setChatRooms(prev => {
            const targetIndex = prev.findIndex(
              room => room.room_id === topic
            );
            if (targetIndex < 0) {
              return prev;
            }
            const targetRoom = prev[targetIndex];
            const updatedRoom = {
              ...targetRoom,
              last_msg: parseChatPayload(msg).chat_msg,
              unread_count: (targetRoom.unread_count ?? 0) + 1,
              mod_sdate: new Date().toISOString(),
            };
            const next = [...prev];
            next.splice(targetIndex, 1);
            return [
              updatedRoom,
              ...next,
            ];
          });
        });
      }
      else {
        MqttUtil.unsubscribeAll('ChatListScreen');
      }
      setMyMemId(memberInfo.mem_id ?? 0);
    }
    fetchMyMemberInfo();

    return () => {
      MqttUtil.unsubscribeAll('ChatListScreen');
    };
  }, []);

  // 초기 진입시 로딩 관리
  useEffect(() => {
    if (hasHandledInitialLoadingRef.current) {
      return;
    }
    if (isLoading) {
      setLoading(true);
      return;
    }
    setLoading(false);
    hasHandledInitialLoadingRef.current = true;
  }, [isLoading, setLoading]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    setChatRooms(results);
  }, [results]);

  // 카테고리에 따른 필터 및 데이터 가공
  const filteredChatRooms = useMemo(() => {
    const filtered =
      activeCategory === ""
        ? chatRooms
        : chatRooms.filter((room) => room.room_type === activeCategory);

    return filtered.map((room) => {
      if (room.room_type !== COMM_CONSTANTS.COMM_MEMBER) {
        return room;
      }

      // room_name 항목 형식: "회원ID$닉네임$썸네일URL"
      const others = room.room_name
        .split(",")
        .map((item) => item.trim())
        .map((item) => {
          const [memId, memNick, thumb] = item.split("$");
          return { memId: Number(memId), memNick, thumb };
        })
        .filter(({ memId }) => memId !== myMemId);

      return {
        ...room,
        room_name: others.map(({ memNick }) => memNick).join(","),
        thumb_url: others.find(({ thumb }) => thumb)?.thumb || room.thumb_url,
      };
    });
  }, [activeCategory, chatRooms, myMemId]);

  const renderChatRoom = ({ item }: { item: RoomData }) => {
    const updatedText = formatRelativeTime(item.mod_sdate || item.reg_sdate);
    const messagePreview = isImageMessage(item.last_msg) ? "(사진)" : item.last_msg || "대화를 시작해 보세요.";
    const roomImageSource = item.thumb_url && !imageErrors[item.room_id]
      ? { uri: item.thumb_url }
      : null;
    return (
    <TouchableOpacity
      style={styles.chatRow}
      activeOpacity={0.6}
      onPress={() =>
        router.push({
          pathname: "/chats",
          params: {
            room_id       : item.room_id,
            room_name     : item.room_name,
            room_type     : item.room_type,
            expiry_date   : item.expiry_date
          },
        })
      }
    > 
      <View style={styles.roomImageWrapper}>
        {roomImageSource ? (
          <Image
            source={roomImageSource}
            style={styles.roomImage}
            onError={() => setImageErrors((prev) => ({ ...prev, [item.room_id]: true }))}
          />
        ) : (
          <View style={styles.roomImage}>
            <ImageDefault width={65} height={65} />
          </View>
        )}
      </View>

      <View style={styles.chatTextContainer}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.roomTitle}
          >
            {item.room_name}
          </Text>
          <Text style={styles.updatedText}>{updatedText}</Text>
        </View>

        <View style={styles.previewRow}>
          <Text numberOfLines={1} style={styles.previewText}>{messagePreview}</Text>

          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {item.unread_count > 99 ? '99+' : item.unread_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader />

      {/* 카테고리 탭 */}
      <CategoryTab data={activeCategory} onPress={setActiveCategory} isMember={true} />

      <FlatList
        data={filteredChatRooms}
        keyExtractor={(item) => item.room_id}
        renderItem={renderChatRoom}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={[
          styles.listContainer,
          filteredChatRooms.length === 0 && styles.listContainerEmpty,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        alwaysBounceVertical
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>참여 중인 채팅방이 없습니다.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal : 20,
    paddingBottom     : 24,
  },
  listContainerEmpty: {
    flexGrow          : 1,
  },
  chatRow: {
    flexDirection     : "row",
    alignItems        : "center",
    paddingVertical   : 12,
  },
  roomImageWrapper: {
    width             : 60,
    height            : 60,
    marginRight       : 14,
  },
  roomImage: {
    width             : 60,
    height            : 60,
    borderRadius      : 23,
    overflow          : "hidden",
  },
  chatTextContainer: {
    flex              : 1,
    gap               : 4,
  },
  titleRow: {
    flexDirection     : "row",
    alignItems        : "center",
  },
  roomTitle: {
    maxWidth          : "72%",
    fontSize          : 16,
    fontFamily        : 'Pretendard-Medium',
    color             : COLOR.COLOR_323232,
    marginEnd         : 3,
  },
  updatedText: {
    fontSize          : 12,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
  },
  previewText: {
    fontSize          : 14,
    fontFamily        : 'Pretendard-Regular',
    color             : COLOR.TEXT_DEFAULT,
    flex              : 1,
  },
  divider: {
    height            : 1,
    backgroundColor   : COLOR.COMM_GRAY_6,
  },
  previewRow: {
    flexDirection     : 'row',
    alignItems        : 'center',
    marginTop         : 4,
  },
  unreadBadge: {
    minWidth          : 20,
    height            : 20,
    borderRadius      : 10,
    paddingHorizontal : 5,
    marginEnd         : 8,
    backgroundColor   : COLOR.APP_ACTIVE_1,
    justifyContent    : 'center',
    alignItems        : 'center',
  },
  unreadBadgeText: {
    fontSize          : 12,
    color             : COLOR.COMM_WHITE,
  },
  emptyContainer: {
    flex              : 1,
    justifyContent    : "center",
    alignItems        : "center",
    paddingBottom     : 80,
  },
  emptyText: {
    color             : COLOR.TEXT_GRAY,
    fontSize          : 14,
  },
});
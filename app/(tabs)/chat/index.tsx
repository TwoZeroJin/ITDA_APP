import CommHeader from "@/components/comm/CommHeader";
import { COLOR, COMM_CONSTANTS, COMM_STYLES } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { useChatRoomListPaging } from "@/hooks/queries/useChat";
import { RoomData } from "@/types";
import { useAuthRouter } from "@/components/comm/AuthRoute";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { CategoryTab } from "@/components/CategoryTab";
import ImageDefault from "@/assets/images/no_image.svg";
import { formatRelativeTime, getMemberInfo } from "@/utils/commUtil";

/**
 * 채팅 리스트 화면
 */
export default function ChatListScreen() {
  const router = useAuthRouter();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { setLoading } = useLoading();
  const [myMemId, setMyMemId] = useState<number>(0);
  const hasHandledInitialLoadingRef = useRef(false);
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatRoomListPaging({
    page_no   : 0,
    page_size : 20
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
      }
    fetchMyMemberInfo();
  }, []);

  // 화면 포커스시 재조회
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

  // 카테고리에 따른 필터 및 
  const filteredChatRooms = useMemo(() => {
    const filtered =
      activeCategory === ""
        ? results
        : results.filter((room) => room.room_type === activeCategory);

    return filtered.map((room) => {
      if (room.room_type !== COMM_CONSTANTS.COMM_MEMBER) {
        return room;
      }

      const roomTitle = room.room_name
        .split(",")
        .map((item) => item.trim())
        .filter((item) => {
          const [memId] = item.split("$");
          return Number(memId) !== myMemId;
        })
        .map((item) => {
          const [, memNick] = item.split("$");
          return memNick;
        })
        .join(",");

      return {
        ...room,
        room_name: roomTitle,
      };
    });
  }, [activeCategory, results, myMemId]);

  const renderChatRoom = ({ item }: { item: RoomData }) => {
    const updatedText = formatRelativeTime(item.mod_sdate || item.reg_sdate);
    const messagePreview = item.last_msg || "대화를 시작해 보세요.";
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
            room_id   : item.room_id,
            room_name : item.room_name,
            room_type : item.room_type,
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
    width             : 65,
    height            : 65,
    marginRight       : 14,
  },
  roomImage: {
    width             : 65,
    height            : 65,
    borderRadius      : 14,
    overflow          : "hidden",
  },
  chatTextContainer: {
    flex              : 1,
    gap               : 6,
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
    marginRight       : 6,
  },
  updatedText: {
    marginTop         : 4,
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
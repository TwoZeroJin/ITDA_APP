import CommHeader from "@/components/CommHeader";
import { COLOR } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { useChatRoomListPaging } from "@/hooks/queries/useChat";
import { RoomData } from "@/types";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CategoryTab } from "@/components/CategoryTab";

function formatUpdatedText(dateText?: string): string {
  if (!dateText) {
    return "방금전";
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  const diffMs = Date.now() - date.getTime();
  const minuteMs = 1000 * 60;
  const hourMs = minuteMs * 60;
  const dayMs = hourMs * 24;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return `${minutes}분전`;
  }

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return `${hours}시간전`;
  }

  const days = Math.max(1, Math.floor(diffMs / dayMs));
  return `${days}일전`;
}

export default function ChatListScreen() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatRoomListPaging({
    page_no   : 0,
    page_size : 20
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

  const filteredChatRooms = useMemo(() => {
    if (activeCategory === "") {
      return results;
    }

    return results.filter((room) => room.room_type === activeCategory);
  }, [activeCategory, results]);

  const renderChatRoom = ({ item }: { item: RoomData }) => {
    const updatedText = formatUpdatedText(item.mod_sdate || item.reg_sdate);
    const messagePreview = item.last_msg || "대화를 시작해 보세요.";
    const roomImageSource = item.thumb_url && !imageErrors[item.room_id]
      ? { uri: item.thumb_url }
      : require('@/assets/images/no_image.png');

    return (
    <TouchableOpacity
      style={styles.chatRow}
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
        <Image
          source={roomImageSource}
          style={styles.roomImage}
          onError={() => setImageErrors((prev) => ({ ...prev, [item.room_id]: true }))}
        />
      </View>

      <View style={styles.chatTextContainer}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.roomTitle}>
            {item.room_name}
          </Text>
          <Text style={styles.updatedText}>{updatedText}</Text>
        </View>
        <Text numberOfLines={1} style={styles.previewText}>
          {messagePreview}
        </Text>
      </View>
    </TouchableOpacity>
  );
  };

  return (
    <View style={styles.container}>
      <CommHeader />

      {/* 카테고리 탭 */}
      <CategoryTab data={activeCategory} onPress={setActiveCategory} />

      <FlatList
        data={filteredChatRooms}
        keyExtractor={(item) => String(item.room_id)}
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
  container: {
    flex            : 1,
    backgroundColor : COLOR.COMM_WHITE,
  },
  categoryRow: {
    flexDirection     : "row",
    alignItems        : "center",
    gap               : 8,
    paddingHorizontal : 20,
    paddingTop        : 20,
    paddingBottom     : 18,
  },
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
    paddingVertical   : 16,
  },
  roomImageWrapper: {
    width             : 72,
    height            : 72,
    marginRight       : 14,
  },
  roomImage: {
    width             : 72,
    height            : 72,
    borderRadius      : 14,
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
    fontSize          : 20,
    color             : COLOR.TEXT_2F2F2F,
    fontWeight        : 700,
    marginRight       : 6,
  },
  updatedText: {
    marginTop         : 4,
    fontSize          : 15,
    color             : COLOR.TEXT_DEFAULT,
    fontWeight        : 500,
  },
  previewText: {
    fontSize          : 16,
    color             : COLOR.TEXT_DEFAULT,
  },
  divider: {
    height            : 1,
    backgroundColor   : COLOR.COMM_GRAY_6,
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
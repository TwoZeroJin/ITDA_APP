import CommHeader from "@/components/CommHeader";
import { COLOR } from "@/constants";
import { useChatRoomListPaging } from "@/hooks/queries/useChat";
import { RoomData } from "@/types";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ChatCategory = "all" | "social" | "club" | "class";

interface ChatRoomItem {
  id: string;
  category: ChatCategory;
  roomTitle: string;
  updatedText: string;
  messagePreview: string;
  roomImage: ImageSourcePropType;
}

const CATEGORY_TABS: { key: ChatCategory; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "social", label: "소셜링" },
  { key: "club", label: "클럽" },
  { key: "class", label: "클래스" },
];

function mapRoomTypeToCategory(roomType?: string): ChatCategory {
  const normalizedType = (roomType ?? "").toLowerCase();

  if (normalizedType.includes("social") || normalizedType === "s" || normalizedType === "n") {
    return "social";
  }

  if (normalizedType.includes("club") || normalizedType === "c" || normalizedType === "g") {
    return "club";
  }

  if (normalizedType.includes("class") || normalizedType === "l") {
    return "class";
  }

  return "social";
}

function getRoomImageByCategory(category: ChatCategory): ImageSourcePropType {
  if (category === "club") {
    return require("@/assets/testImages/test_recommend_image1.png");
  }

  if (category === "class") {
    return require("@/assets/testImages/test_review_image1.png");
  }

  return require("@/assets/testImages/test_recommend_image2.png");
}

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

function toChatRoomItem(room: RoomData): ChatRoomItem {
  const category = mapRoomTypeToCategory(room.room_type);

  return {
    id: String(room.room_id),
    category,
    roomTitle: room.room_name,
    updatedText: formatUpdatedText(room.last_msg_sdate || room.mod_sdate || room.reg_sdate),
    messagePreview: room.last_msg || room.last_chat_msg || "대화를 시작해 보세요.",
    roomImage: getRoomImageByCategory(category),
  };
}

export default function ChatListScreen() {
  const [activeCategory, setActiveCategory] = useState<ChatCategory>("all");
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatRoomListPaging({
    page_no: 0,
    page_size: 20,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const chatRooms = useMemo(() => {
    return results.map(toChatRoomItem);
  }, [results]);

  const filteredChatRooms = useMemo(() => {
    if (activeCategory === "all") {
      return chatRooms;
    }

    return chatRooms.filter((room) => room.category === activeCategory);
  }, [activeCategory, chatRooms]);

  const renderCategoryTab = (category: { key: ChatCategory; label: string }) => {
    const isActive = activeCategory === category.key;

    return (
      <TouchableOpacity
        key={category.key}
        style={[styles.categoryChip, isActive && styles.categoryChipActive]}
        onPress={() => setActiveCategory(category.key)}
      >
        <Text
          style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}
        >
          {category.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderChatRoom = ({ item }: { item: ChatRoomItem }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() =>
        router.push({
          pathname: "/chats",
          params: {
            room_id   : item.id,
            room_name : item.roomTitle,
          },
        })
      }
    > 
      <View style={styles.roomImageWrapper}>
        <Image source={item.roomImage} style={styles.roomImage} />
      </View>

      <View style={styles.chatTextContainer}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.roomTitle}>
            {item.roomTitle}
          </Text>
          <Text style={styles.updatedText}>{item.updatedText}</Text>
        </View>
        <Text numberOfLines={1} style={styles.previewText}>
          {item.messagePreview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommHeader />

      {/* 카테고리 탭 */}
      <View style={styles.categoryRow}>{CATEGORY_TABS.map(renderCategoryTab)}</View>

      <FlatList
        data={filteredChatRooms}
        keyExtractor={(item) => item.id}
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
    flex: 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  categoryChip: {
    borderRadius: 18,
    backgroundColor: COLOR.COMM_GRAY,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  categoryChipActive: {
    backgroundColor: COLOR.APP_MAIN,
  },
  categoryChipText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLOR.TEXT_GRAY,
  },
  categoryChipTextActive: {
    color: COLOR.COMM_WHITE,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  roomImageWrapper: {
    width: 72,
    height: 72,
    marginRight: 14,
  },
  roomImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  chatTextContainer: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomTitle: {
    maxWidth: "72%",
    fontSize: 20,
    color: COLOR.TEXT_2F2F2F,
    fontWeight: "700",
    marginRight: 6,
  },
  updatedText: {
    marginTop: 4,
    fontSize: 15,
    color: COLOR.TEXT_DEFAULT,
    fontWeight: "500",
  },
  previewText: {
    fontSize: 16,
    color: COLOR.TEXT_DEFAULT,
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.COMM_GRAY_6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyText: {
    color: COLOR.TEXT_GRAY,
    fontSize: 14,
  },
});
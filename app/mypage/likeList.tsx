import CommHeader from '@/components/comm/CommHeader';
import { CategoryTab } from '@/components/CategoryTab';
import CommCard2 from '@/components/comm/CommCard2';
import { COLOR, COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import { useMemberLike, useMemberLikeListPaging } from '@/hooks/queries/useMember';
import { LikeData } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

/**
 * 좋아요 리스트 화면
 */
export default function LikeListScreen() {
  const memberLike = useMemberLike();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMemberLikeListPaging({
    page_no   : 0,
    page_size : 10,
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredMeets = useMemo(() => {
    if (activeCategory === "") {
      return results;
    }

    const typeMap: Record<string, string> = {
      [COMM_CONSTANTS.COMM_MEET]: COMM_CONSTANTS.TARGET_MEET,
      [COMM_CONSTANTS.COMM_GROUP]: COMM_CONSTANTS.TARGET_GROUP,
      // [COMM_CONSTANTS.COMM_CLASS]: COMM_CONSTANTS.TARGET_CLASS,
    };

    const targetType = typeMap[activeCategory];
    if (!targetType) return results;

    return results.filter((item) => item.target_type === targetType);
  }, [activeCategory, results]);

  const visibleMeets = useMemo(
    () => filteredMeets.filter((item) => !removedIds.has(item.target_id)),
    [filteredMeets, removedIds],
  );

  // 좋아요 취소 — 낙관적으로 즉시 제거, 실패 시 롤백
  const handleLikePress = (targetId: number, targetType: string) => {
    if (!targetId) return;

    setRemovedIds((prev) => new Set(prev).add(targetId));

    memberLike.mutate(
      { target_id: targetId, target_type: targetType, flag: false },
      {
        onError: () => {
          setRemovedIds((prev) => {
            const next = new Set(prev);
            next.delete(targetId);
            return next;
          });
        },
      },
    );
  };

  const renderCard = ({ item }: { item: LikeData }) => {
    return (
      <CommCard2
        item={item}
        onPress={() => {
          if (item.target_type === COMM_CONSTANTS.TARGET_MEET) {
            router.push({
              pathname: '/meets/detailView',
              params: { meetId: item.target_id },
            });
            return;
          }
          if (item.target_type === COMM_CONSTANTS.TARGET_GROUP) {
            router.push({
              pathname: '/groups/detailView',
              params: { groupId: item.target_id },
            });
          }
        }}
        onLikePress={() => handleLikePress(item.target_id, item.target_type)}
      />
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={"좋아요 내역"} isBack={true} isLogo={false} isLike={false} isNoti={false} />
      <CategoryTab data={activeCategory} onPress={setActiveCategory} />

      <FlatList
        data={visibleMeets}
        keyExtractor={(item) => `${item.target_type}-${item.target_id}`}
        renderItem={renderCard}
        contentContainerStyle={[
          styles.listContainer,
          filteredMeets.length === 0 && styles.listContainerEmpty,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>좋아요한 모임이 없습니다.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal : 16,
    paddingVertical   : 16,
  },
  listContainerEmpty: {
    flexGrow          : 1,
  },
  emptyContainer: {
    flex              : 1,
    justifyContent    : 'center',
    alignItems        : 'center',
    paddingBottom     : 80,
  },
  emptyText: {
    color             : COLOR.TEXT_GRAY,
    fontSize          : 14,
  },
});
import CommHeader from '@/components/comm/CommHeader';
import { CategoryTab } from '@/components/CategoryTab';
import CommCard2 from '@/components/comm/CommCard2';
import { COLOR, COMM_CONSTANTS, COMM_STYLES } from '@/constants';
import { useMemberApplyGroupListPaging, useMemberApplyMeetListPaging, useMemberLike, useMemberMyGroupListPaging, useMemberMyMeetListPaging } from '@/hooks/queries/useMember';
import { GroupInfo, MeetInfo } from '@/types';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import TopTabButton from '@/components/comm/TopTabButton';
import { isMeetItem } from '@/utils/commUtil';

/**
 * 내가 만든/참여한 소셜링/클럽 목록 화면
 */
export default function HistoryListScreen() {
  const memberLike = useMemberLike();
  const [activeType, setActiveType] = useState(COMM_CONSTANTS.COMM_MEET);
  const [activeCategory, setActiveCategory] = useState(COMM_CONSTANTS.TYPE_APPLY);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isClub = activeType === COMM_CONSTANTS.COMM_GROUP;
  const isMy   = activeCategory === COMM_CONSTANTS.TYPE_MY;
  const myMeetQuery = useMemberMyMeetListPaging({
    page_no       : 0,
    page_size     : 10,
  }, { enabled: !isClub && isMy });
  const applyMeetQuery = useMemberApplyMeetListPaging({
    page_no       : 0,  
    page_size     : 10,
  }, { enabled: !isClub && !isMy });
  const myGroupQuery = useMemberMyGroupListPaging({
    page_no       : 0,
    page_size     : 10,
  }, { enabled: isClub && isMy });
  const applyGroupQuery = useMemberApplyGroupListPaging({
    page_no       : 0,
    page_size     : 10,
  }, { enabled: isClub && !isMy });

  const currentQuery = isClub ? (isMy ? myGroupQuery : applyGroupQuery) : (isMy ? myMeetQuery : applyMeetQuery);
  const emptyText = isClub ? ( isMy ? '만든 클럽이 없습니다.' : '참여한 클럽이 없습니다.') : ( isMy ? '만든 소셜링이 없습니다.' : '참여한 소셜링이 없습니다.');

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await currentQuery.refetch();
    setIsRefreshing(false);
  }, [currentQuery]);
  const handleTabPress = (tab: string) => {
    setActiveType(tab);
  };

  const handleEndReached = () => {
    if (currentQuery.hasNextPage && !currentQuery.isFetchingNextPage) {
      currentQuery.fetchNextPage();
    }
  };

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo | GroupInfo) => {
    const targetId = isClub ? (item as GroupInfo).group_id : (item as MeetInfo).meet_id;
    memberLike.mutate(
      {
        target_id: targetId,
        target_type: isClub ? 'G' : 'M',
        flag: item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
        },
      },
    );
  };

  const renderCard = ({ item }: { item: MeetInfo | GroupInfo }) => {
    const isMeet = isMeetItem(item);
    return (
      <CommCard2
        item={item}
        onPress={(pressedItem) => {
          if (isMeetItem(pressedItem)) {
            router.push({
              pathname: '/meets/detailView',
              params: { meetId: pressedItem.meet_id },
            });
            return;
          }
          else {
            router.push({
              pathname: '/groups/detailView',
              params: { groupId: item.group_id },
            });
          }
        }}
        onLikePress={() => handleLikePress(item)}
      />
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={"나의 이력"} isBack={true} isLogo={false} isLike={false} isNoti={false} />
      <TopTabButton
        activeValue={activeType}
        onTabPress={handleTabPress}
      />
      <CategoryTab data={activeCategory} onPress={setActiveCategory} isMyTab={true} />

      <FlatList
        data={currentQuery.results}
        keyExtractor={(item) => `${item.apply_stat}-${item.apply_ratio}`}
        renderItem={renderCard}
        contentContainerStyle={[
          styles.listContainer,
          currentQuery.results.length === 0 && styles.listContainerEmpty,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal : 16,
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
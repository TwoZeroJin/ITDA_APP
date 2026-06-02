import CommHeader from '@/components/comm/CommHeader';
import CommMeetCard2, { MeetCardData } from '@/components/comm/CommMeetCard2';
import { COLOR, COMM_STYLES } from '@/constants';
import { useMemberMyGroupListPaging } from '@/hooks/queries/useMember';
import { GroupInfo } from '@/types';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CommBottomButton from '@/components/comm/CommBottomButton';
import { useAuthRouter } from '@/components/comm/AuthRoute';

/**
 * 클럽 소셜링 - 클럽 선택
 */
export default function SelectGroupScreen() {
  const router = useAuthRouter();
  const { meet_type } = useLocalSearchParams();
  const [group_id, setGroupId] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMemberMyGroupListPaging({
    page_no   : 0,
    page_size : 20,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

  const renderMeetCard = ({ item }: { item: GroupInfo }) => {
    const cardItem: MeetCardData = {
      id           : item.group_id,
      type         : 'G',
      name         : item.group_name,
      subjectName  : item.group_subj_name,
      thumbUrl     : item.thumb_url,
      placeAddr    : item.place_addr,
      applyRatio   : item.apply_ratio,
      hostNick     : item.mem_nick,
      hostImageUrl : item.mem_image_url,
    };

    return (
      <CommMeetCard2
        item={cardItem}
        selected={group_id === item.group_id}
        onPress={(pressedItem) => setGroupId(Number(pressedItem.id))}
      />
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={"클럽 선택"} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.group_id}`}
        renderItem={renderMeetCard}
        contentContainerStyle={[
          styles.listContainer,
          results.length === 0 && styles.listContainerEmpty,
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>만든 클럽이 없습니다.</Text>
            </View>
          ) : null
        }
      />

      <CommBottomButton label="다음" onPress={() => meet_type && group_id > 0 && router.navigate({
          pathname: '/meets/createDetail',
          params: {
            group_id : group_id,
            meet_type : meet_type
          },
        })}
        disabled={!meet_type || group_id < 1}/>
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
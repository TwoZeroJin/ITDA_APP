import CommHeader from '@/components/comm/CommHeader';
import CommCard2 from '@/components/comm/CommCard2';
import { COLOR, COMM_STYLES } from '@/constants';
import { useMemberAllGroupListPaging } from '@/hooks/queries/useMember';
import { GroupInfo } from '@/types';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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

  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMemberAllGroupListPaging({
    page_no   : 0,
    page_size : 20,
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

  const renderCard = ({ item }: { item: GroupInfo }) => {
    return (
      <CommCard2
        item={item}
        selected={group_id === item.group_id}
        onPress={() => setGroupId(Number(item.group_id))}
      />
    );
  };

  return (
    <View style={COMM_STYLES.container}>
      <CommHeader title={"클럽 선택"} isBack={true} isLogo={false} isLike={false} isNoti={false} />

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.group_id}`}
        renderItem={renderCard}
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
              <Text style={styles.emptyText}>클럽이 없습니다.</Text>
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
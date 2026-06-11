import CommHeader from '@/components/comm/CommHeader';
import TopTabButton from '@/components/comm/TopTabButton';
import CommunityFeed from '@/components/CommunityFeed';
import { COLOR } from '@/constants';
import IconPencil from '@/assets/images/icon_community.svg';
import { StyleSheet, Text, FlatList, View, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReviewList } from "@/hooks/queries/useCommunity";
import { useAuthRouter } from '@/components/comm/AuthRoute';
import { useLoading } from '@/contexts/LoadingContext';

export default function CommunityListScreen() {
  const router = useAuthRouter();
  const [activeType, setActiveType] = useState<string>('latest');
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useReviewList({
    page_no       : 0,
    page_size     : 5,
    sch_condition : activeType, 
    sch_keyword   : String(3) 
  });
  // 화면 재진입시 재조회
  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch(); 
    setRefreshing(false);
  }, [refetch]);
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); 
    }
  };

  const tabs: Array<{ label: string; value: string }> = [
    { label: '최신', value: 'latest' },
    { label: '모임 후기', value: 'review' },
    { label: '내가 쓴 글', value: 'mypost' },
  ];
  
  return (
    <View style={{ flex: 1 }}>
      <CommHeader />
      <TopTabButton
        tabs={tabs}
        activeValue={activeType}
        onTabPress={setActiveType}
        rightAction={{
          element: <IconPencil width={22} height={22} />,
          onPress: () => router.navigate('/communities/chooseWriteType'),
        }}
      />
        <FlatList 
          data={results}
          renderItem={({item}) => <CommunityFeed data={item} />}
          keyExtractor={(item) => item.review_id?.toString() || ''} 
          onRefresh={onRefresh} 
          refreshing={refreshing} 
          onEndReached={loadMore} 
          onEndReachedThreshold={0.5} 
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>데이터가 없습니다</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={{ marginVertical: 20 }} />
            ) : <View style={{ height: 50 }} />
          }    
        />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems            : 'center',
    justifyContent        : 'center',
    paddingVertical       : 40,
  },
  emptyText: {
    fontSize              : 14,
    color                 : COLOR.TEXT_GRAY,
  },
});
import CommHeader from '@/components/comm/CommHeader';
import TopTabButton from '@/components/comm/TopTabButton';
import CommunityFeed from '@/components/CommunityFeed';
import { COLOR } from '@/constants';
import IconPencil from '@/assets/images/icon_community.svg';
import { StyleSheet, Text, FlatList, View, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReviewList } from "@/hooks/queries/useCommunity";
import { SearchParams } from '@/types';
import * as commUtil from '@/utils/commUtil';

export default function community() {
  const [activeType, setActiveType] = useState<string>('latest');
  const [refreshing, setRefreshing] = useState(false);
  const [myMemId, setMyMemId] = useState<number>(0);

  const { results, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useReviewList({
    page_no       : 0,
    page_size     : 5,
    sch_condition : activeType, 
    sch_keyword   : 3 
  } as SearchParams);

  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await commUtil.getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
    };

    fetchMyMemberInfo();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
    { label: '모임 후기', value: 'meet_review' },
    { label: '내가 쓴 글', value: 'mypost' },
  ];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1 }}>
      <CommHeader isNoti={true} isSetting={false} isLike={true} />
      <TopTabButton
        tabs={tabs}
        activeValue={activeType}
        onTabPress={setActiveType}
        rightAction={{
          element: <IconPencil width={20} height={20} />,
          onPress: () => router.navigate('/communities/chooseWriteType'),
        }}
      />

        <FlatList 
          data={results}
          renderItem={({item}) => <CommunityFeed data={item} memId={myMemId}/>}
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
  pencilButton: {
    paddingRight          : 16,
    paddingBottom         : 15,
  },
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
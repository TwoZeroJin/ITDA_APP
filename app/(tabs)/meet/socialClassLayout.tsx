import CommunityMeet from '@/components/CommunityMeet';
import SearchInput from '@/components/SearchInput';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, View, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react';
import { useMeetListPaging } from "@/hooks/queries/useMeet";
import { SearchParams, MeetInfo } from '@/types';
import CategoryListLayout from '@/components/CategoryListLayout';
import DividingLine from '@/components/DividingLine';

export default function SocialClassLayout({ activeType }: { activeType: 'social' | 'class' }) {
  const [refreshing, setRefreshing] = useState(false);
  const activeTypeLabel = activeType === 'social' ? '소셜링' : '클래스';

  const { 
    results, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    refetch 
  } = useMeetListPaging({
    page_no : 0,
    page_size : 5,
    sch_condition: activeType,
  } as SearchParams);

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

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList 
        data={results}
        renderItem={({ item }) => (
          <CommunityMeet data={item as MeetInfo} type='MEET'/>
        )}
        keyExtractor={(item) => item.meet_id.toString()} 
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.headerGroup}>
            <SearchInput />
            <CategoryListLayout />
            <DividingLine />
            <View style={styles.titleWrapper}>
              <Text style={styles.listTitle}>전체 {activeTypeLabel}</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={{ marginVertical: 20 }} />
          ) : <View style={{ height: 100 }} />
        }    
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>후기를 작성할 수 있는 모임이 없습니다.</Text>
          </View>
        } 
      />
    </View>
  );
}  

const styles = StyleSheet.create({
  headerGroup: {
    backgroundColor: COLOR.COMM_WHITE, // 카테고리까지는 흰색 배경 유지
//    paddingBottom: 10,
  },
  titleWrapper: {
    backgroundColor: '#F5F5F5', // 제목부터는 리스트 배경색과 동일하게
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLOR.COMM_GRAY_2,
  },  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    color: '#333333',
  },
});
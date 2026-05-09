import CommHeader from '@/components/CommHeader';
// CommunityFeed 대신 사진과 유사한 리스트 아이템 컴포넌트를 사용한다고 가정합니다.
import CommunityMeet from '@/components/CommunityMeet';
import SearchInput from '@/components/SearchInput';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMeetListPaging } from "@/hooks/queries/useMeet";
import { SearchParams, MeetInfo } from '@/types';
import CategoryListLayout from '@/components/CategoryListLayout';
import DividingLine from '@/components/DividingLine';


export default function Meet() {
  const [activeType, setActiveType] = useState<'social' | 'club' | 'class'>('social');
  const [refreshing, setRefreshing] = useState(false);
  const [myMemId, setMyMemId] = useState<number>(0);

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

  const renderButton = (label: string, type: 'social' | 'club' | 'class') => {
    const isActive = activeType === type;
    return (
      <TouchableOpacity onPress={() => setActiveType(type)} style={styles.tabButton}>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {label}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommHeader isNoti={true} isSetting={false} isLike={true} />
      {/* 사진 상단의 탭 바 (소셜링, 클럽, 클래스 느낌) */}
      <View style={styles.tabContainer}>
        {renderButton('소셜링', 'social')}
        {renderButton('클럽', 'club')}
        {renderButton('클래스', 'class')}
      </View>

      {/* 검색 입력 */}
      {/* <SearchInput /> */}

      {/* 카테고리 목록 출력 */}
      {/* <CategoryListLayout /> */}

        {/* CommunityListItem은 사진의 카드 레이아웃을 구현한 컴포넌트여야 합니다. */}
        {/*클릭 시 데이터를 가지고 작성 화면으로 이동*/}
        {/*  console.log('아이템 클릭:상세 화면으로 이동', item), // 클릭된 아이템 로그*/}
        <FlatList 
          data={results}
          renderItem={({ item }) => (
            // <TouchableOpacity 
            //   onPress={() => {
            //     console.log('클릭된 아이템 ID:', item.meet_id);
                
            //     router.navigate({
            //     pathname: '/meets/meetDetailPage',
            //     params: {
            //       meetId: item.meet_id,
            //     },
            //   })}}
            // >
              <CommunityMeet data={item as MeetInfo} type='MEET'/>
            // </TouchableOpacity>
          )}
          keyExtractor={(item) => item.meet_id.toString()} // meet_id를 고유 키로 사용
          onRefresh={onRefresh}
          refreshing={refreshing}
          // onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <View style={styles.headerGroup}>
              <SearchInput />
              <CategoryListLayout />
              <DividingLine />
              <View style={styles.titleWrapper}>
                <Text style={styles.listTitle}>BEST 10 소셜링</Text>
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
      {/* 사진 우측 하단의 플로팅 글쓰기 버튼 */}
      <TouchableOpacity 
        style={styles.floatingButton}
        activeOpacity={0.85}
        onPress={() => router.navigate('/meets/create')}
      >
        <MaterialCommunityIcons name="plus" size={32} color={COLOR.COMM_WHITE} />
      </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 사진처럼 약간 밝은 회색 배경
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.COMM_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    justifyContent: 'flex-start', 
    paddingHorizontal: 16, // 전체적인 왼쪽 여백    
  },
  tabButton: {
// ✅ flex: 1을 제거해야 왼쪽으로 정렬됩니다.
    alignItems: 'center',
    paddingVertical: 15,
    // ✅ 메뉴 사이의 간격을 조절 (사진처럼 촘촘하게)
    marginRight: 50,
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999999',
  },
  activeTabText: {
    color: COLOR.APP_ACTIVE_3, // 사진의 포인트 컬러 (주홍/분홍 계열)
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
// ✅ 텍스트 길이에 맞춰 인디케이터 너비 조절
    width: '100%', 
    height: 3,
    backgroundColor: '#FF5A5F',
    borderRadius: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    color: '#333333',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF7A7A', // 사진의 플러스 버튼 색상
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
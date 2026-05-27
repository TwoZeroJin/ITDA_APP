import CommHeader from '@/components/comm/CommHeader';
import CommunityFeed from '@/components/CommunityFeed';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReviewList } from "@/hooks/queries/useCommunity";
import { SearchParams } from '@/types';
import * as commUtil from '@/utils/commUtil';

export default function community() {
  // ✅ 기본 선택: 'latest'
  const [activeType, setActiveType] = useState<'latest' | 'mypost' | 'meet_review'>('latest');
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 관리
  const [myMemId, setMyMemId] = useState<number>(0);

  // ✅ 1. API 호출: 현재 선택된 탭(activeType)에 따라 조회가 필요하다면 body에 담아 보냅니다.
  const { 
    results,          
    fetchNextPage,    
    hasNextPage,      
    isFetchingNextPage, 
    isLoading,         
    refetch
  } = useReviewList({
    page_no : 0,
    page_size : 5,
    sch_condition: activeType, 
    sch_keyword: 3 
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

  // 피드 종류 버튼 렌더링 함수
  const renderButton = (label: string, type: 'latest' | 'meet_review' | 'mypost') => {
    const isActive = activeType === type;
    return (
      <TouchableOpacity 
        style={styles.tabButton}
        activeOpacity={0.6}
        onPress={() => setActiveType(type)} 
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {label}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

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
        <View style={styles.titleContainer}>
          {/* 메뉴들을 감싸는 영역 */}
          <View style={styles.activeTabWrapper}>
            {renderButton('최신', 'latest')}
            {renderButton('모임 후기', 'meet_review')}
            {renderButton('내가 쓴 글', 'mypost')}
          </View>          
          {/* 제일 오른쪽 연필 아이콘 */}
          <TouchableOpacity 
            style={styles.pencilButton}
            onPress={() => router.navigate('/communities/chooseWriteType')}
          >
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList 
          data={results}
          renderItem={({item}) => <CommunityFeed data={item} memId={myMemId}/>}
          keyExtractor={(item) => item.review_id?.toString() || ''} 
          onRefresh={onRefresh} 
          refreshing={refreshing} 
          onEndReached={loadMore} 
          onEndReachedThreshold={0.5} 
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
  titleContainer: {
    width: '100%',
    backgroundColor: COLOR.COMM_WHITE,
    flexDirection: 'row',
    alignItems: 'flex-end',          // 하단 라인을 맞추기 위해 고정
    justifyContent: 'space-between', // 양 끝 정렬 (메뉴들 왼쪽, 연필 오른쪽)
    borderBottomWidth: 3,
    borderBottomColor: '#EEEEEE',    
  },
  activeTabWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingLeft: 16,                 // ✅ CommHeader의 홈 아이콘 위치와 맞추기 위한 왼쪽 여백
    gap: 35,                         // ✅ 3개 메뉴 사이의 공간을 더 넓힘 (원하시는 만큼 숫자 조절 가능)
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999999',
  },
  activeTabText: {
    color: COLOR.APP_ACTIVE_3, 
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0, 
    width: '100%', 
    height: 3, 
    backgroundColor: COLOR.APP_ACTIVE_3, 
    borderRadius: 2,
  },
  pencilButton: {
    paddingRight: 16,                // ✅ 오른쪽 끝 여백 배치
    paddingBottom: 15,               // 글자들과 높이 밸런스를 맞추기 위한 하단 패딩
  },
  feedTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,     
    paddingHorizontal: 15,  
    backgroundColor: COLOR.COMM_WHITE,
  },
  feedTypeBtn: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
import CommHeader from '@/components/CommHeader';
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
  const [activeType, setActiveType] = useState<'latest' | 'mypost' | 'review'>('latest');
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 관리
  const [myMemId, setMyMemId] = useState<number>(0);

  // ✅ 1. API 호출: 현재 선택된 탭(activeType)에 따라 조회가 필요하다면 body에 담아 보냅니다.
  // 여기서는 초기 진입 시 기본 조회를 수행합니다.
  const { 
    results,          // 가공된 데이터 배열
    fetchNextPage,    // 다음 페이지 호출 함수
    hasNextPage,      // 다음 페이지 존재 여부
    isFetchingNextPage, // 다음 페이지 로딩 중 상태
    isLoading,         // 첫 로딩 상태
    refetch
  } = useReviewList({
    // 서버에서 요구하는 기본 검색 파라미터 (예시)
    page_no : 0,
    page_size : 5,
    sch_condition: activeType, // 'latest', 'mypost', 'review' 중 하나
    mem_id: 3 //myMemId, // 실제 mem_id는 로그인 정보에서 가져와야 함
  } as SearchParams);

  // 내 mem_id 정보 조회. 한번 조회해서 상태에 저장해두면 이후 API 호출 시 활용 가능
  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await commUtil.getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
    };

    fetchMyMemberInfo();
  }, []);

  //화면 진입할때마다 새로고침하여 재조회
  useFocusEffect(
    useCallback(() => {
      // 화면이 포커스(진입)될 때마다 데이터를 새로 가져옵니다.
      refetch();
    }, [refetch])
  );
  // ✅ 화면을 위로 당겼을 때 실행될 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch(); // 데이터를 1페이지부터 다시 불러옴
    setRefreshing(false);
  }, [refetch]);

  // 스크롤이 바닥에 닿았을 때 실행될 함수
  const loadMore = () => {
    // console.log('Load more triggered--------------');
    // console.log('다음 페이지 존재 여부(hasNextPage):', hasNextPage);
    // console.log('현재 로딩 중인가(isFetchingNextPage):', isFetchingNextPage);

    if (hasNextPage && !isFetchingNextPage) {
      //console.log('fetchNextPage--------------');
      fetchNextPage(); // react-query의 infiniteQuery 기능을 활용해 자동으로 다음 페이지 호출
    }
  };
  // 피드 종류 버튼 렌더링 함수
  const renderButton = (label: string, type: 'latest' | 'mypost' | 'review') => {
    const isActive = activeType === type;
    //피드 종류 버튼 : 최신, 인기, 모임 후기
    return (
      <TouchableOpacity onPress={() => setActiveType(type)}>
        <Text
          style={[
            styles.feedTypeBtn,
            {
              backgroundColor: isActive ? COLOR.APP_ACTIVE_3 : COLOR.COMM_GRAY,
              color: isActive ? COLOR.COMM_WHITE : COLOR.COMM_GRAY_2,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
      );
  };

  // ✅ 로딩 중일 때 보여줄 화면
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
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={styles.titleContainer}>
          {/* ✅ '피드' 텍스트와 밑줄을 감싸는 View 추가 */}
          <View style={styles.activeTabWrapper}>
            <Text style={styles.titleText}>피드</Text>
            {/* ✅ 여기에 실제 색상 줄이 들어갑니다. */}
            <View style={styles.activeIndicator} />
          </View>          
          {/* <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: COLOR.APP_ACTIVE_3}}>피드</Text> */}
          <TouchableOpacity onPress={() => router.navigate('/communities/chooseWriteType')}>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.feedTypeContainer}>
          {renderButton('최신', 'latest')}
          {renderButton('모임 후기', 'review')}
          {renderButton('내가 쓴 글', 'mypost')}
        </View>
        {/* ✅ 피드 리스트 출력 부분 */}
        <FlatList 
        data={results}
        renderItem={({item}) => <CommunityFeed data={item} />}
        keyExtractor={(item) => item.review_id?.toString() || ''} // review_id가 없을 경우 대비

        // ----------------------------------------
        // ✅ Pull to Refresh 설정
        // ----------------------------------------
        onRefresh={onRefresh} // 위로 당기면 실행
        refreshing={refreshing} // 당기는 중일 때 스피너 표시 여부
        // 무한 스크롤 핵심 설정
        onEndReached={loadMore} // 바닥에 닿았을 때 호출
        onEndReachedThreshold={0.5} // 리스트 끝의 50% 지점에 도달하면 loadMore 실행
        
        // 추가 데이터 로딩 중일 때 하단 스피너 표시
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={{ marginVertical: 20 }} />
          ) : <View style={{ height: 50 }} />
        }    
        //contentContainerStyle={{ paddingBottom: 20 }}    
        />
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: '100%',
    // ✅ 밑줄이 잘 보이도록 하단 마진과 패딩을 조정합니다.
    paddingTop: 16,
    backgroundColor: COLOR.COMM_WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#EEEEEE', // 전체적인 경계선
  },
  // ✅ '피드' 글자와 밑줄을 묶어주는 스타일
  activeTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 12, // 글자와 줄 사이의 간격
  },
  titleText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: COLOR.APP_ACTIVE_3
  },
  // ✅ 핵심: 메뉴 아래에 뜨는 색상 줄 스타일
  activeIndicator: {
    position: 'absolute',
    bottom: 0, // 컨테이너 바닥에 붙임
    width: '100%', // 글자 너비만큼 꽉 차게
    height: 3, // 줄 두께
    backgroundColor: COLOR.APP_ACTIVE_3, // '피드' 글자색과 동일한 포인트 컬러
    borderRadius: 2,
  },
  feedTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,     // 위아래 간격
    paddingHorizontal: 15,  // 왼쪽 간격
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
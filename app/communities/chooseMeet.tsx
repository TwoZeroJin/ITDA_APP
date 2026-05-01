import React, { useEffect,useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { CodeInfo, MyMeetInfo, SearchParams } from '@/types';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLOR } from '@/constants';
import { getCategoryList } from '@/utils/commUtil';
import CommunityMeet from '@/components/CommunityMeet';
import { useMyMeetListNoReview } from '@/hooks/queries/useCommunity';
import CommHeader from '@/components/CommHeader';
const { width } = Dimensions.get('window');

export default function chooseMeet() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const recommendPage = [];
  recommendPage.push({
    data :  categoryList.slice(0, 3)
  })

  // ✅ 1. API 호출 (페이징 없는 버전)
  const { results, isLoading, isError } = useMyMeetListNoReview({
    // 필요한 검색 파라미터 세팅
    // 예: mem_id는 보통 서버 세션이나 전역 상태에서 처리하지만 
    // 파라미터가 필요하다면 여기에 추가
    sch_condition: '3', // API에서 요구하는 조건이 있다면 추가
  } as SearchParams);  

  useEffect(() => {
    const fetchData = async () => {
      // SecureStore에서 카테고리 코드 목록 가져오기
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, []);
  
  // ✅ 2. 로딩 상태 처리
  if (isLoading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
        <Text style={{ marginTop: 10, color: COLOR.COMM_GRAY_2 }}>모임 목록을 불러오고 있어요...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <CommHeader isLogo={false} isNoti={false} isSetting={false} isLike={false} title="커뮤니티 작성"/>


      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.titleSmall}>커뮤니티 작성</Text>
        <View style={{ width: 40 }} />
      </View> */}

      {/* 소모임 생성 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleBig}>후기를 작성할 모임을 선택해주세요.</Text>
      </View>
      {/* 추천 소셜링 섹션 */}
      {/* ✅ 피드 리스트 출력 부분 */}
      <FlatList 
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity 
            // 클릭 시 데이터를 가지고 작성 화면으로 이동
            onPress={() => router.navigate({
              pathname: '/communities/writeFeedback',
              params: { data: JSON.stringify(item) }
            })}
          >
            <CommunityMeet data={item as MyMeetInfo} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.meet_id?.toString() || ''} // meet_id가 없을 경우 대비
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>후기를 작성할 수 있는 모임이 없습니다.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}

/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#f2f2f2',
  },
  backButton: { width: 40, justifyContent: 'center', alignItems: 'flex-start' },
  container: {
    flex: 1,
    backgroundColor: COLOR.COMM_WHITE,
  },
  titleContainer: {
    // marginBottom: 20,
    alignItems: 'center',
  },
  titleSmall: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#222' 
  },
  titleBig: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.COMM_BLACK,
    marginBottom: 4,
  },
  // 추천 소셜링 모임
  recommendContainer: {
    marginTop: 10,
    // paddingHorizontal: 16,
  },
  recommendListContainer: {
    marginTop: 16,
  },
  recommendItemContainer: {
    width: width - 35,
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
  },
  recommendItemImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  recommendImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendLikeBtnContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  recommendTagContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  recommendTagMeet: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLOR.COMM_WHITE,
    backgroundColor: COLOR.BG_MEET,
  },
  recommendTagClub: {
    fontSize: 12,
    borderRadius: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: COLOR.TEXT_31AD69,
    backgroundColor: COLOR.BG_CLUB,
  },
  recommendTagCategory: {
    fontSize: 12,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
    backgroundColor: COLOR.COMM_GRAY,
  },
  recommendContentContainer: {
    gap: 4,
  },
  recommendContentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.TEXT_3C3C3C,
  },
  recommendContentText: {
    fontSize: 12,
    marginStart: -8,
    color: COLOR.COMM_SHADOW,
  },
  recommendHostText: {
    fontSize: 14,
    marginStart: -8,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
  },
});
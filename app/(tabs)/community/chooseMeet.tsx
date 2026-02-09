import React, { useEffect,useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { CodeInfo } from '@/types';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLOR } from '@/constants';
import { getCategoryList } from '@/utils/commUtil';
import CommunityMeet from '@/components/CommunityMeet';
import { MeetInfo } from '@/types';
const { width } = Dimensions.get('window');

export default function chooseMeet() {
  const [categoryList, setCategoryList] = useState<CodeInfo[]>([]);
  const recommendPage = [];
  recommendPage.push({
    data :  categoryList.slice(0, 3)
  })

  useEffect(() => {
    const fetchData = async () => {
      // SecureStore에서 카테고리 코드 목록 가져오기
      setCategoryList(await getCategoryList());
    }

    fetchData();
  }, []);

  //나의 모임 후기 작성할수있는 목록 출력
  const meetList = [
    {
      meet_id: 1,
      meet_name: '등산 모임',
      place_type: '야외',
      place_addr: '서울시 관악구',
      mem_id: 123,
      mem_name: '김민지',
      group_id: 10,
      meet_image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDFH67uLDMYYsKb8b5m0lZzjlEl4adocQFA&s',
    },
    {
      meet_id: 2,
      meet_name: '독서 클럽',
      place_type: '실내',
      place_addr: '서울시 마포구',
      mem_id: 123,
      mem_name: '이민지',
      group_id: 20,
      meet_image_url: 'https://www.readersnews.com/news/photo/202209/106729_75354_5330.jpg',
    },
    {
      meet_id: 3,
      meet_name: '요가 클래스',
      place_type: '실내',
      place_addr: '서울시 강남구',
      mem_id: 123,
      mem_name: '박민수',
      group_id: 30,
      meet_image_url: 'https://img.kr.gcp-karroter.net/community/community/20250822/92f1a87f-b385-4419-ac9a-93fda5600b2b.png?q=80&s=480x480&t=inside',
    }
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.titleSmall}>커뮤니티 작성</Text>
        <View style={{ width: 40 }} />
      </View>
      {/* 소모임 생성 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleBig}>후기를 작성할 모임을 선택해주세요.</Text>
      </View>
      {/* 추천 소셜링 섹션 */}
      {/* ✅ 피드 리스트 출력 부분 */}
      <FlatList 
      data={meetList}
      renderItem={({item}) => <CommunityMeet data={item as MeetInfo} />}
      keyExtractor={(item) => item.meet_id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: COLOR.BTN_BORDER,
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
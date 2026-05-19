import CommHeader from '@/components/CommHeader';
import { COLOR } from '@/constants';
import { BannerData } from '@/types';
import { getMainBannerList } from '@/utils/commUtil';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchButton from '@/assets/images/search_button.svg';
import IconClose from '@/assets/images/icon_close.svg';
import CreateFloatingButton from '@/components/CreateFloatingButton';
import IconCreate from '@/assets/images/icon_create.svg';
import CommCategoryList from '@/components/CommCategoryList';
import CommRcmdMeetList from '@/components/CommRcmdMeetList';
import CommUpcomingMeetList from '@/components/CommUpcomingMeetList';
import CommReviewList from '@/components/CommReviewList';
import ImageCarousel from "@/components/ImageCarousel";
import { useMainData } from '@/hooks/queries/useMain';
import DividingLine from '@/components/DividingLine';
import { router } from 'expo-router';

/**
 * 메인 화면
 */
export default function HomeScreen() {
  const [bannerList, setBannerList] = useState<BannerData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { upcomingMeetList, hotMeetList, recommendMeetList, newClassList, reviewList, refetch } = useMainData();

  // 위로 땡겨서 새로고침
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  useEffect(() => {
    const fetchData = async () => {
      setBannerList(await getMainBannerList());
    }

    fetchData();
  }, []);
  
  const recommendSections = [
    {
      key: 'hot',
      title: '핫한 소셜링',
      subTitle: '요즘 다 여기서 만나요 👀 지금 참여하기!',
      data: hotMeetList,
    },
    {
      key: 'recommend',
      title: '추천 소셜링',
      subTitle: '취향에 맞는 모임을 확인해 보세요.',
      data: recommendMeetList,
    },
    {
      key: 'new-class',
      title: '신규 클래스',
      subTitle: '방금 등록된 새로운 클래스를 만나보세요.',
      data: newClassList,
    },
  ].filter((section) => section.data.length > 0);

  const recentSearches = ['보드게임', '등산', '독서', '영화', '요리'];

  return (
    <View style={{ flex: 1 }}>
      <CommHeader/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={[styles.container, { flex : 1, paddingHorizontal: 16}]}>
          {/* 검색 조건 부분 */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>참여하고 싶은 모임이나 클럽을 검색해 보세요.</Text>
            <TouchableOpacity
              // onPress={() => router.navigate('/search')}
              >
              <SearchButton width={20} height={20}/>
            </TouchableOpacity>
          </View>
          {/* 최근 검색어 */}
          <View style={styles.recentSearchContainer}>
            <FlatList
              data={recentSearches}
              renderItem={({ item }) => (
                <View style={styles.recentSearchItem}>
                  <TouchableOpacity
                    // onPress={() => handleSearch(item)}
                  >
                    <Text style={styles.recentSearchText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // onPress={() => handleRemoveRecentSearch(item)}
                  >
                    <IconClose width={12} height={12} style={{ marginStart: 4 }} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* 공지사항 섹션 */}
          {/* <View style={styles.notiContainer}>
            <Noti width={12} height={13}/>
            <Text style={styles.notiMessage}>잇다에서 공지사항을 등록했어요.</Text>
          </View> */}
        </View>

        {/* 메인 배너 리스트 */}
        <View style={styles.bannerContainer}>
          <ImageCarousel
            images={bannerList.map((banner) => banner.banner_image_url)}
            height={250}
            imageRadius={12}
            // onPressImage={(i) => console.log("pressed image", i)} // 추후 배너 클릭 시 상세 페이지 이동 기능 추가 시 활용
          />
        </View>

        {/* 다가오는 모임 리스트 섹션 */}
        <CommUpcomingMeetList upcomingMeetList={upcomingMeetList} />

        {/* 카테고리 섹션 */}
        <CommCategoryList />

        <DividingLine />

        {/* 추천 소셜링 섹션 */}
        <CommRcmdMeetList sections={recommendSections} />

        <DividingLine />

        {/* 함께한 이야기 섹션 */}
        <CommReviewList reviewList={reviewList} />

      </ScrollView>
      {/* Floating 버튼, 소셜링/클럽 생성 버튼 (화면에 고정) */}
      <CreateFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor   : COLOR.COMM_WHITE,
  },
  bannerContainer: {
    padding           : 16,
    backgroundColor   : COLOR.COMM_WHITE,
  },
  notiContainer: {
    flexDirection     : 'row',
    alignItems        : 'center',
    alignSelf         : 'center',
    width             : '80%',
    height            : 30,
    bottom            : 14,
    backgroundColor   : COLOR.COMM_WHITE,
    borderRadius      : 20,
    paddingHorizontal : 14,
  },
  notiMessage: {
    fontSize          : 12,
    marginStart       : 6,
    color             : COLOR.TEXT_DEFAULT,
  },
  // 검색 섹션
  searchContainer: {
    marginTop: 16,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLOR.APP_ACTIVE_3,
    borderWidth: 2,
    borderRadius: 25,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  searchText: {
    fontSize: 14,
    color: COLOR.COMM_GRAY_2,
  },
  recentSearchContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  recentSearchItem: {
    backgroundColor: COLOR.COMM_GRAY,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: COLOR.TEXT_DEFAULT,
    marginEnd: 6,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  recentSearchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.COMM_SHADOW,
  },
});
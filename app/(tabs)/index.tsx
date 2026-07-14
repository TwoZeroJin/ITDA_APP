import CommHeader from '@/components/comm/CommHeader';
import { COLOR } from '@/constants';
import { BannerData } from '@/types';
import { getMainBannerList } from '@/utils/commUtil';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import CommFloatingButton from '@/components/comm/CommFloatingButton';
import CommCategoryList from '@/components/comm/CommCategoryList';
import CommUpcomingMeetList from '@/components/comm/CommUpcomingMeetList';
import CommReviewList from '@/components/comm/CommReviewList';
import ImageCarousel from "@/components/comm/ImageCarousel";
import { useMainData } from '@/hooks/queries/useMain';
import DividingLine from '@/components/DividingLine';
import SearchInput from '@/components/SearchInput';
import { useLoading } from '@/contexts/LoadingContext';
import CommHorizontalList from '@/components/comm/CommHorizontalList';

/**
 * 메인 화면
 */
export default function HomeScreen() {
  const [bannerList, setBannerList] = useState<BannerData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [schText, setSchText] = useState('');
  const [schCategory, setSchCategory] = useState('');
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const { upcomingMeetList, hotMeetList, recommendMeetList, newClassList, reviewList, hotGroupList, recommendGroupList, isLoading, refetch } = useMainData(schCategory, schText);

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

  const handleSearchKey = useCallback((keyword: string) => {
    setSchText(keyword);
  }, []);

  const handleCategorySelect = useCallback((codeId: string) => {
    setSchCategory(codeId);
  }, []);

  // 위로 땡겨서 새로고침
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    const fetchData = async () => {
      setBannerList(await getMainBannerList());
    }

    fetchData();
  }, []);

  useEffect(() => {
    refetch();
  }, [schCategory, schText, refetch]);
  
  const recommendSections = [
    {
      key       : 'hotMeet',
      title     : '핫한 소셜링',
      subTitle  : '요즘 다 여기서 만나요 👀 지금 참여하기!',
      data      : hotMeetList,
    },
    {
      key       : 'recommendMeet',
      title     : '추천 소셜링',
      subTitle  : '취향에 맞는 모임을 확인해 보세요.',
      data      : recommendMeetList,
    },
    {
      key       : 'hotGroup',
      title     : '핫한 클럽',
      subTitle  : '요즘 다 여기서 만나요 👀 지금 참여하기!',
      data      : hotGroupList,
    },
    {
      key       : 'recommendGroup',
      title     : '추천 클럽',
      subTitle  : '취향에 맞는 클럽을 확인해 보세요.',
      data      : recommendGroupList,
    },
    // {
    //   key       : 'new-class',
    //   title     : '신규 클래스',
    //   subTitle  : '방금 등록된 새로운 클래스를 만나보세요.',
    //   data      : newClassList,
    // },
  ];

  return (
    <View style={{ flex: 1 }}>
      <CommHeader />
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
        {/* 검색 섹션 */}
        <SearchInput searchKey={handleSearchKey} />

        {/* 메인 배너 리스트 */}
        <View style={styles.bannerContainer}>
          <ImageCarousel
            images={bannerList.map((banner) => banner.banner_image_url)}
            height={250}
            imageRadius={12}
          />
        </View>

        {/* 다가오는 모임 리스트 섹션 */}
        <CommUpcomingMeetList upcomingMeetList={upcomingMeetList} />

        {/* 카테고리 섹션 */}
        <CommCategoryList onCategorySelect={handleCategorySelect} />

        <DividingLine />

        {/* 추천 소셜링 섹션 */}
        <CommHorizontalList sections={recommendSections} />

        <DividingLine />

        {/* 함께한 이야기 섹션 */}
        <CommReviewList title="함께한 이야기" subTitle="우리가 함께한 순간, 진심이 담긴 후기 📝" reviewList={reviewList} />

      </ScrollView>
      {/* Floating 버튼, 소셜링/클럽 생성 버튼 (화면에 고정) */}
      <CommFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    padding           : 16,
    backgroundColor   : COLOR.COMM_WHITE,
  },
});
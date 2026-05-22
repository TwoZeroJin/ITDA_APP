import SearchInput from '@/components/SearchInput';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useMeetListPaging } from "@/hooks/queries/useMeet";
import { MeetInfo, SearchParams } from '@/types';
import CategoryListLayout from '@/components/CategoryListLayout';
import DividingLine from '@/components/DividingLine';
import DropdownModal from '@/components/modal/DropdownModal';
import IconFilter from '@/assets/images/icon_filter.svg';
import CommMeetCard from '@/components/comm/CommMeetCard';
import { useMemberLike } from '@/hooks/queries/useMember';

export default function SocialClassLayout({ activeType }: { activeType: 'social' | 'class' }) {
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const activeTypeLabel = activeType === 'social' ? '소셜링' : '클래스';
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const memberLike = useMemberLike();
  // ✅ activeType이 변경되면 모달을 닫아주는 이펙트 추가
  useEffect(() => {
    setIsDetailMenuVisible(false);
  }, [activeType]); // 👈 activeType이 바뀔 때마다 이 안의 함수가 실행됩니다.
  
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
    sch_category: selectedCategory,
    sch_text: searchKey
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

  const DETAIL_MENU_ITEMS = [
    {
      label: '최신순',
      onPress: () => {
        setSortType('latest'); // 상태 변경 -> 화면 리렌더링 유발
        setIsDetailMenuVisible(false);
      },
    },
    {
      label: '과거순',
      onPress: () => {
        setSortType('oldest');
        setIsDetailMenuVisible(false);
      },
    },
  ];
  // 3. FlatList에 데이터를 밀어 넣기 전에 원본 복사 후 정렬 처리하기
  const sortedResults = results ? [...results].sort((a, b) => {
    if (sortType === 'latest') {
      return b.meet_id - a.meet_id; // meet_id 역순 (최신순)
    } else {
      return a.meet_id - b.meet_id; // meet_id 정순 (과거순)
    }
  }) : [];


  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLOR.APP_ACTIVE_3} />
      </View>
    );
  }

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo) => {
    if (!item.meet_id) {
      return;
    }

    memberLike.mutate(
      {
        target_id   : item.meet_id,
        target_type : 'M',
        flag        : item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
        },
        onError: () => {
        },
      },
    );
  };
  //카테고리 조회 
  const handlePressSearch = (code_id: string) => {
    console.log('Selected category code_id:', code_id); // ✅ 선택된 카테고리 코드 확인 로그
    if (!code_id) {
      return;
    }
    if (selectedCategory === code_id) {
      refetch(); // 👈 리액트 쿼리에게 강제로 새로고침하라고 명령합니다 (0번 페이지부터 다시 조회)
      return;
    }
    setSelectedCategory(code_id);
  };
  //키워드 조회 
  const handleKeySearch = (searchKey: string) => {
    console.log('Selected category code_id:', searchKey); // ✅ 선택된 카테고리 코드 확인 로그

    setSelectedCategory('');
    if (searchKey === searchKey) {
      refetch(); // 👈 리액트 쿼리에게 강제로 새로고침하라고 명령합니다 (0번 페이지부터 다시 조회)
      return;
    }
    setSearchKey(searchKey);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList 
        data={sortedResults}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.recommendListContainer}>
            <CommMeetCard
              item={item}
              onLikePress={(item) => handleLikePress(item)} />
          </View>
        )}
        keyExtractor={(item) => item.meet_id.toString()} 
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        // 👇 1. 헤더 자체의 레이어 순서를 리스트 아이템보다 위로 강제 격상시킵니다.
        ListHeaderComponentStyle={{ zIndex: 10 }} 

        // 👇 2. 리스트 아이템들이 헤더 위로 덮어쓰지 못하도록 아이템 레이어를 낮춥니다.
        CellRendererComponent={({ children, ...props }) => (
          <View {...props} style={[props.style, { zIndex: 1 }]}>
            {children}
          </View>
        )}        

        ListHeaderComponent={
          <View style={styles.headerGroup}>
            <SearchInput searchKey={(searchKey) => handleKeySearch(searchKey)}/>
            <CategoryListLayout searchCategory={(codeId) => handlePressSearch(codeId)}/>
            <DividingLine />
            <View style={styles.titleWrapper}>
              <Text style={styles.listTitle}>전체 {activeTypeLabel}</Text>
              {/* ✅ 아이콘과 모달을 감싸는 기준점 뷰 생성 */}
              <View style={styles.filterWrapper}>
                <TouchableOpacity 
                  activeOpacity={0.6} 
                  onPress={() => setIsDetailMenuVisible(true)}
                  style={styles.filterButton}
                >
                  <IconFilter width={20} height={20} />
                </TouchableOpacity>

                {/* 바깥 영역 터치 시 닫히는 백드롭만 최상위에 유지 */}
                {isDetailMenuVisible && (
                  <TouchableOpacity
                    style={styles.detailMenuBackdrop}
                    activeOpacity={1}
                    onPress={() => setIsDetailMenuVisible(false)}
                  />
                )}
                {/* ✅ 드롭다운 모달을 전체 화면 레이어에서 이 자리로 이동 */}
                {isDetailMenuVisible && (
                  <View style={styles.dropdownContainer}>
                    <DropdownModal
                      items={DETAIL_MENU_ITEMS}
                      position="right"
                      visible={isDetailMenuVisible}
                      onVisibleChange={setIsDetailMenuVisible}
                    />
                  </View>
                )}              
            </View>
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
  recommendListContainer: {
    marginTop         : 16,
    marginLeft        : 16,
  },
// ✅ 텍스트와 아이콘을 한 줄로 정렬하도록 대폭 수정
  titleWrapper: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',          // 👈 가로 배치의 핵심
    justifyContent: 'space-between', // 👈 제목은 왼쪽 끝, 아이콘은 오른쪽 끝으로 양분
    alignItems: 'center',          // 👈 글자와 아이콘의 수직 중앙 정렬선 맞추기
    paddingRight: 16,              // 👈 아이콘이 우측 스크린 벽에 너무 붙지 않게 여백 추가
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
// ✅ 아이콘과 모달의 기준점이 될 정렬 스타일
  filterWrapper: {
    position: 'relative', // 안쪽 자식 요소들의 absolute 기준점이 됨
    alignItems: 'flex-end',
  },
  filterButton: {
    padding: 8,
  },
  // ✅ 아이콘 바로 아래에 위치하도록 강제 조정
  dropdownContainer: {
    position: 'absolute',
    top: 40, // filterButton 패딩을 고려하여 아이콘 바로 아래에 배치
    right: 0,
    zIndex: 100, // 가장 위에 뜨도록 보장
  },  
  // 바깥 레이아웃 클릭 시 닫히는 투명 배경
  detailMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // 어두워지지 않도록 투명하게 처리 (원하시면 rgba 변경 가능)
    zIndex: 1,
  },
});
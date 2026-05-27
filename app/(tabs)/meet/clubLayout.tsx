import SearchInput from '@/components/SearchInput';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCallback, useState } from 'react';
import {  useFocusEffect } from 'expo-router';
import DividingLine from '@/components/DividingLine';
import { useGroupListPaging } from '@/hooks/queries/useGroup';
import IconFilter from '@/assets/images/icon_filter.svg';
import DropdownModal from '@/components/modal/DropdownModal';
import CommGroupCard from '@/components/comm/CommGroupCard';
import { useMemberLike } from '@/hooks/queries/useMember';
import CommCategoryList from '@/components/comm/CommCategoryList';


export default function ClubLayout() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // 1. 컴포넌트 상단에 정렬 기준 상태(State) 추가
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  const memberLike = useMemberLike();
  const { 
    results, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    refetch 
  } = useGroupListPaging({
    page_no : 0,
    page_size : 5,
    sch_category: selectedCategory,
    sch_text: searchKey
  });

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
      return b.group_id - a.group_id; // group_id 역순 (최신순)
    } else {
      return a.group_id - b.group_id; // group_id 정순 (과거순)
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
  const handleLikePress = (groupId: number, like_yn: string) => {
    if (!groupId) {
      return;
    }

    memberLike.mutate(
      {
        target_id   : groupId,
        target_type : 'G',
        flag        : like_yn === 'N',
      },
      {
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
            <CommGroupCard
              item={item}
              onLikePress={(item) => handleLikePress(item.group_id, item.like_yn)}            
            />
          </View>
        )}
        keyExtractor={(item) => item.group_id.toString()} 
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
            <CommCategoryList onCategorySelect={(codeId) => handlePressSearch(codeId)}/>
            <DividingLine />
            
            <View style={styles.titleWrapper}>
              <Text style={styles.listTitle}>전체 클럽</Text>
              
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
    backgroundColor: COLOR.COMM_WHITE,
  },
  recommendListContainer: {
    marginTop         : 16,
    marginLeft        : 16,
  },
  titleWrapper: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    paddingTop: 10,
    zIndex: 2, // 헤더 컴포넌트가 리스트 아이템 위로 올라오도록 설정
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
  // 바깥 레이아웃 클릭 시 닫히는 투명 배경
  detailMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // 어두워지지 않도록 투명하게 처리 (원하시면 rgba 변경 가능)
    zIndex: 1,
  },
});
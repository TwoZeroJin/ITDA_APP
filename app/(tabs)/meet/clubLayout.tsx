import SearchInput from '@/components/SearchInput';
import { COLOR } from '@/constants';
import { StyleSheet, Text, FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCallback, useState } from 'react';
import {  useFocusEffect } from 'expo-router';
import { GroupInfo } from '@/types';
import DividingLine from '@/components/DividingLine';
import { useGroupListPaging } from '@/hooks/queries/useGroup';
import IconFilter from '@/assets/images/icon_filter.svg';
import DropdownModal from '@/components/modal/DropdownModal';
import { useMemberLike } from '@/hooks/queries/useMember';
import CommCategoryList from '@/components/comm/CommCategoryList';
import CommCard from '@/components/comm/CommCard';


export default function ClubLayout() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortType, setSortType] = useState<'latest' | 'oldest'>('latest');
  const memberLike = useMemberLike();
  const { results, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useGroupListPaging({
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

  const sortedResults = results ? [...results].sort((a, b) => {
    if (sortType === 'latest') {
      return b.group_id - a.group_id; // group_id 역순 (최신순)
    } else {
      return a.group_id - b.group_id; // group_id 정순 (과거순)
    }
  }) : [];

  // 좋아요 처리
  const handleLikePress = (item: GroupInfo) => {
    if (!item.group_id) {
      return;
    }

    memberLike.mutate(
      {
        target_id   : item.group_id,
        target_type : 'G',
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
    if (!code_id) {
      return;
    }
    if (selectedCategory === code_id) {
      refetch();
      return;
    }
    setSelectedCategory(code_id);
  };
  //키워드 조회 
  const handleKeySearch = (searchKey: string) => {
    setSelectedCategory('');
    if (searchKey === searchKey) {
      refetch();
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
            <CommCard
              item={item}
              onLikePress={(item) => handleLikePress(item as GroupInfo)}            
            />
          </View>
        )}
        keyExtractor={(item) => item.group_id.toString()} 
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponentStyle={{ zIndex: 10 }} 
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
              
              {/* 아이콘과 모달을 감싸는 기준점 뷰 생성 */}
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
                {/* 드롭다운 모달을 전체 화면 레이어에서 이 자리로 이동 */}
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
            <Text style={styles.emptyText}>등록된 클럽이 없습니다.</Text>
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
    zIndex: 2,
  },
  filterWrapper: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  filterButton: {
    padding: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
    zIndex: 100,
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
  detailMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});
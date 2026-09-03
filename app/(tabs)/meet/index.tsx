import CommHeader from '@/components/comm/CommHeader';
import CommFloatingButton from '@/components/comm/CommFloatingButton';
import TopTabButton from '@/components/comm/TopTabButton';
import SearchInput from '@/components/SearchInput';
import CommCategoryList from '@/components/comm/CommCategoryList';
import CommCard from '@/components/comm/CommCard';
import DividingLine from '@/components/DividingLine';
import DropdownModal from '@/components/modal/DropdownModal';
import IconFilter from '@/assets/images/icon_filter.svg';
import { COLOR, COMM_CONSTANTS } from '@/constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMeetListPaging } from '@/hooks/queries/useMeet';
import { useGroupListPaging } from '@/hooks/queries/useGroup';
import { useMemberLike } from '@/hooks/queries/useMember';
import { GroupInfo, MeetInfo } from '@/types';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * 소셜링/클럽 전체 리스트 화면
 */
export default function MeetGroupListScreen() {
  const [activeType, setActiveType] = useState(COMM_CONSTANTS.COMM_MEET);
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortType, setSortType] = useState('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const memberLike = useMemberLike();
  const isClub = activeType === COMM_CONSTANTS.COMM_GROUP;
  const meetQuery = useMeetListPaging({
    page_no       : 0,
    page_size     : 10,
    sch_category  : selectedCategory,
    sch_text      : searchKey,
  }, { enabled: !isClub });
  const groupQuery = useGroupListPaging({
    page_no       : 0,
    page_size     : 10,
    sch_category  : selectedCategory,
    sch_text      : searchKey,
  }, { enabled: isClub });

  const currentQuery = isClub ? groupQuery : meetQuery;
  const listTitle = isClub ? '전체 클럽' : '전체 소셜링';
  const emptyText = isClub ? '등록된 클럽이 없습니다.' : '등록된 모임이 없습니다.';

  const sortedResults = useMemo(() => {
    const source = (isClub ? groupQuery.results : meetQuery.results) as Array<MeetInfo | GroupInfo>;

    return [...source].sort((a, b) => {
      const aId = isClub ? (a as GroupInfo).group_id : (a as MeetInfo).meet_id;
      const bId = isClub ? (b as GroupInfo).group_id : (b as MeetInfo).meet_id;
      return sortType === 'latest' ? bId - aId : aId - bId;
    });
  }, [isClub, groupQuery.results, meetQuery.results, sortType]);

  const DETAIL_MENU_ITEMS = [
    {
      label: '최신순',
      onPress: () => {
        setSortType('latest');
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

  // 초기 진입시 로딩 관리
  useEffect(() => {
    if (hasHandledInitialLoadingRef.current) {
      return;
    }
    if (currentQuery.isLoading) {
      setLoading(true);
      return;
    }
    setLoading(false);
    hasHandledInitialLoadingRef.current = true;
  }, [currentQuery.isLoading, setLoading]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await currentQuery.refetch();
    setRefreshing(false);
  }, [currentQuery]);
  const handleTabPress = (tab: string) => {
    setActiveType(tab);
    setIsDetailMenuVisible(false);
  };
  const handleEndReached = () => {
    if (currentQuery.hasNextPage && !currentQuery.isFetchingNextPage) {
      currentQuery.fetchNextPage();
    }
  };

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo | GroupInfo) => {
    const targetId = isClub ? (item as GroupInfo).group_id : (item as MeetInfo).meet_id;
    memberLike.mutate(
      {
        target_id: targetId,
        target_type: isClub ? 'G' : 'M',
        flag: item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
        },
      },
    );
  };

  // 검색어/ 카테고리 체크
  const handlePressSearch = (codeId: string) => {
    if (selectedCategory === codeId) {
      setSelectedCategory('');
      return;
    }
    setSelectedCategory(codeId);
  };
  const handleKeySearch = (keyword: string) => {
    setSearchKey(keyword);
    if (searchKey === keyword) {
      currentQuery.refetch();
      return;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CommHeader />
      <TopTabButton
        activeValue={activeType}
        onTabPress={handleTabPress}
      />

      <FlatList
        data={sortedResults}
        keyExtractor={(item) => {
          return isClub
            ? (item as GroupInfo).group_id.toString()
            : (item as MeetInfo).meet_id.toString();
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponentStyle={{ zIndex: 10 }}
        CellRendererComponent={({ children, ...props }) => (
          <View {...props} style={[props.style, { zIndex: 1 }]}>
            {children}
          </View>
        )}
        ListHeaderComponent={
          // 상단 컴포넌트
          <View style={{ backgroundColor: COLOR.COMM_WHITE }}>
            {/* 검색 조건 */}
            <SearchInput searchKey={handleKeySearch} />
            <CommCategoryList onCategorySelect={handlePressSearch} />

            <DividingLine />

            <View style={styles.titleWrapper}>
              <Text style={styles.listTitle}>{listTitle}</Text>

              <View style={styles.filterWrapper}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setIsDetailMenuVisible(true)}
                  style={styles.filterButton}
                >
                  <IconFilter width={20} height={20} />
                </TouchableOpacity>

                {isDetailMenuVisible && (
                  <TouchableOpacity
                    style={styles.detailMenuBackdrop}
                    activeOpacity={1}
                    onPress={() => setIsDetailMenuVisible(false)}
                  />
                )}

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
        renderItem={({ item, index }) => (
          <View key={index} style={styles.recommendListContainer}>
            <CommCard item={item} onLikePress={(data) => handleLikePress(data as MeetInfo | GroupInfo)} />
          </View>
        )}
        ListFooterComponent={
          currentQuery.isFetchingNextPage ? (
            <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={{ marginVertical: 20 }} />
          ) : (
            <View style={{ height: 100 }} />
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        }
      />

      <CommFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  recommendListContainer: {
    paddingHorizontal   : 16,
  },
  titleWrapper: {
    backgroundColor     : '#F5F5F5',
    flexDirection       : 'row',
    justifyContent      : 'space-between',
    alignItems          : 'center',
    paddingRight        : 16,
    paddingTop          : 10,
  },
  filterWrapper: {
    position            : 'relative',
    alignItems          : 'flex-end',
  },
  filterButton: {
    padding             : 8,
  },
  dropdownContainer: {
    position            : 'absolute',
    top                 : 40,
    right               : 0,
    zIndex              : 100,
  },
  detailMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor     : 'transparent',
    zIndex              : 1,
  },
  listTitle: {
    fontSize          : 20,
    fontFamily        : 'Pretendard-SemiBold',
    padding           : 16,
    color             : COLOR.COLOR_323232,
  },
  emptyContainer: {
    flex              : 1,
    marginTop         : 100,
    alignItems        : 'center',
    justifyContent    : 'center',
  },
  emptyText: {
    fontSize          : 16,
    color             : COLOR.COMM_GRAY_2,
  },
});

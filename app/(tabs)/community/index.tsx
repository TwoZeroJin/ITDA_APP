import CommHeader from '@/components/comm/CommHeader';
import TopTabButton from '@/components/comm/TopTabButton';
import CommunityFeed from '@/components/CommunityFeed';
import { COLOR } from '@/constants';
import IconPencil from '@/assets/images/icon_community.svg';
import { StyleSheet, Text, FlatList, View, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReviewDelete, useReviewList } from "@/hooks/queries/useCommunity";
import { useAuthRouter } from '@/components/comm/AuthRoute';
import { useLoading } from '@/contexts/LoadingContext';
import CustomDialog from '@/components/modal/CustomDialog';
import { MeetInfo, MeetReview } from '@/types';
import { showToast } from '@/utils/commToast';
import { useMemberLike } from '@/hooks/queries/useMember';

/**
 * 커뮤니티 탭 메인 화면 - 후기 리스트
 */
export default function CommunityListScreen() {
  const router = useAuthRouter();
  const [activeType, setActiveType] = useState<string>('latest');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [targetItem, setTargetItem] = useState<MeetReview | null>(null);
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useReviewList({
    page_no       : 0,
    page_size     : 10,
    sch_condition : activeType, 
    sch_keyword   : String(3) 
  });
  
  const reviewMutation = useReviewDelete();
  const memberLike = useMemberLike();
  
  // 화면 재진입시 재조회
  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );

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
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); 
    }
  };

  const handleUpdate = (item : MeetReview) => {
    setMenuVisible(false);
    
    router.navigate({
      pathname: '/communities/writeFeedback',
      params: { data: JSON.stringify(item.memMeetListVO),
        updFeedData: JSON.stringify(item)
      }
    })
  };

  const handleDelete = (item: MeetReview) => {
    setMenuVisible(false);
    setTargetItem(item);
    setIsDeleteDialogVisible(true);
  };

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


  return (
    <View style={{ flex: 1 }}>
      <CommHeader />
      <TopTabButton
        activeValue={activeType}
        onTabPress={setActiveType}
        rightAction={{
          element: <IconPencil width={22} height={22} />,
          onPress: () => router.navigate('/communities/chooseWriteType'),
        }}
        isSocialTab={false}
      />
        <FlatList 
          data={results}
          renderItem={({ item}) => {
            return (
              <CommunityFeed 
                item={item}
                menuVisible={menuVisible}
                handleLike={handleLikePress} 
                handleUpdate={handleUpdate} 
                handleDelete={handleDelete} 
              />
            );
          }}
          keyExtractor={(item) => item.review_id?.toString() || ''} 
          onRefresh={onRefresh} 
          refreshing={refreshing} 
          onEndReached={handleEndReached} 
          onEndReachedThreshold={0.5} 
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>데이터가 없습니다</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={COLOR.APP_ACTIVE_3} style={{ marginVertical: 20 }} />
            ) : <View style={{ height: 50 }} />
          }    
        />

      <CustomDialog
        visible={isDeleteDialogVisible}
        title="삭제"
        content="정말로 이 게시글을 삭제하시겠습니까?"
        cancelLabel="닫기"
        confirmLabel="삭제"
        onCancel={() => setIsDeleteDialogVisible(false)}
        onConfirm={() => {
          reviewMutation.mutate(targetItem as MeetReview, {
            onSuccess: () => {
              showToast({ text1: '삭제되었습니다.' })
              refetch();
            },
            onError: () => showToast({ text1: '삭제 중 문제가 발생했습니다.' }),
            onSettled: () => setIsDeleteDialogVisible(false)
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems            : 'center',
    justifyContent        : 'center',
    paddingVertical       : 40,
  },
  emptyText: {
    fontSize              : 14,
    color                 : COLOR.TEXT_GRAY,
  },
});
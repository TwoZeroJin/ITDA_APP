import CommHeader from '@/components/comm/CommHeader';
import TopTabButton from '@/components/comm/TopTabButton';
import CommunityFeed from '@/components/CommunityFeed';
import { COLOR } from '@/constants';
import IconPencil from '@/assets/images/icon_community.svg';
import { StyleSheet, Text, FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReviewDelete, useReviewList } from "@/hooks/queries/useCommunity";
import { useAuthRouter } from '@/components/comm/AuthRoute';
import { useLoading } from '@/contexts/LoadingContext';
import CustomDialog from '@/components/modal/CustomDialog';
import { MeetInfo, MeetReview } from '@/types';
import { showToast } from '@/utils/commToast';
import { useMemberLike } from '@/hooks/queries/useMember';
import { getMemberInfo } from '@/utils/commUtil';
import { useReportBlock } from '@/hooks/queries/useReport';

/**
 * 커뮤니티 탭 메인 화면 - 후기 리스트
 */
export default function CommunityListScreen() {
  const router = useAuthRouter();
  const reviewMutation = useReviewDelete();
  const memberLike = useMemberLike();
  const reportBlock = useReportBlock();
  const [activeType, setActiveType] = useState<string>('latest');
  const [refreshing, setRefreshing] = useState(false);
  const [myMemId, setMyMemId] = useState<number>(0);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isBlockDialogVisible, setIsBlockDialogVisible] = useState(false);
  const [targetItem, setTargetItem] = useState<MeetReview | null>(null);
  const { setLoading } = useLoading();
  const hasHandledInitialLoadingRef = useRef(false);
  const { results, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useReviewList({
    page_no       : 0,
    page_size     : 10,
    sch_condition : activeType, 
    sch_keyword   : String(3) 
  });

  useEffect(() => {
    const fetchMyMemberInfo = async () => {
      const memberInfo = await getMemberInfo();
      setMyMemId(memberInfo.mem_id ?? 0);
      }
    fetchMyMemberInfo();
  }, []);
  
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
    router.navigate({
      pathname: '/communities/writeFeedback',
      params: { data: JSON.stringify(item.memMeetListVO),
        updFeedData: JSON.stringify(item)
      }
    })
  };

  const handleDelete = (item: MeetReview) => {
    setTargetItem(item);
    setIsDeleteDialogVisible(true);
  };

  const handleReport = (item: MeetReview) => {
    router.navigate({
      pathname: '/user/reportCreate',
      params: {
        target_id   : Number(item?.review_id),
        target_type : 'R',
      }
    });
  };

  const handleBlock = (item: MeetReview) => {
    if (myMemId <= 0) {
      showToast({ text1: '로그인이 필요합니다.' });
      return;
    }
    setTargetItem(item);
    setIsBlockDialogVisible(true);
  };

  // 좋아요 처리
  const handleLikePress = (item: MeetInfo | MeetReview) => {
    const isReview = 'review_id' in item;
    const targetId = isReview ? item.review_id : item.meet_id;

    if (!targetId) {
      return;
    }

    memberLike.mutate(
      {
        target_id   : targetId,
        target_type : isReview ? 'R' : 'M',
        flag        : isReview ? item.like_review_yn === 'N' : item.like_yn === 'N',
      },
      {
        onSuccess: () => {
          if (isReview) {
            item.like_review_yn = item.like_review_yn === 'Y' ? 'N' : 'Y';
          } else {
            item.like_yn = item.like_yn === 'Y' ? 'N' : 'Y';
          }
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
              handleLike={handleLikePress} 
              handleReviewLike={handleLikePress}
              handleUpdate={handleUpdate} 
              handleDelete={handleDelete}
              handleReport={handleReport}
              handleBlock={handleBlock}
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
        content="이 게시글을 삭제하시겠습니까?"
        cancelLabel="닫기"
        confirmLabel="삭제"
        onCancel={() => setIsDeleteDialogVisible(false)}
        onConfirm={() => {
          reviewMutation.mutate(targetItem as MeetReview, {
            onSuccess: () => {
              showToast({ text1: '삭제되었습니다.' })
            },
            onError: () => showToast({ text1: '삭제 중 문제가 발생했습니다.' }),
            onSettled: () => setIsDeleteDialogVisible(false)
          });
        }}
      />

      <CustomDialog
        visible={isBlockDialogVisible}
        title="차단"
        content="이 게시글을 차단하시겠습니까?"
        cancelLabel="닫기"
        confirmLabel="차단"
        onCancel={() => setIsBlockDialogVisible(false)}
        onConfirm={() => {
          reportBlock.mutate({
            target_id   : Number(targetItem?.review_id),
            target_type : 'R',
          }, {
            onSuccess: () => {
              showToast({ text1: '차단되었습니다.' })
            },
            onError: () => showToast({ text1: '차단 중 문제가 발생했습니다.' }),
            onSettled: () => setIsBlockDialogVisible(false)
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
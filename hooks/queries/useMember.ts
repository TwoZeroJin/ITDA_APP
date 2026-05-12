import { QUERY_KEYS } from '@/constants';
import { useLoading } from '@/contexts/LoadingContext';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { memberDetail, memberLike, memberLikeList, memberUpdate } from '@/api/member';
import { printDebugLog } from '@/utils/commUtil';
import { MemberInfo, MemberLike, SearchParams } from '@/types';
import queryClient from '@/api/queryClient';

/**
 * 회원 상세 정보 조회 (다가올 모임, 모임 내역, 후기 목록)
 */
function useMemberDetail() {
    const { setLoading } = useLoading();
    const query = useQuery({
        queryFn: memberDetail,
        queryKey: [QUERY_KEYS.MEMBER , QUERY_KEYS.MEMBER_DETAIL],
    });

    // 로딩 상태 관리
    useEffect(() => {
        setLoading(query.isFetching);
    }, [query.isFetching, setLoading]);

    useEffect(() => {
        if (query.isError) {
            printDebugLog('회원 상세 정보 조회 실패', JSON.stringify(query.error));
        }
    }, [query.isError, query.error]);

    return {
        ...query,
        upcomingMeetList    : query.data?.data?.upcoming_meet_list ?? [],
        newClassList        : query.data?.data?.meet_history_list ?? [],
        reviewList          : query.data?.data?.review_list ?? [],
    };
}

/**
 * 회원 정보 수정
 */
function useMemberUpdate() {
    const { setLoading } = useLoading();
    return useMutation({
    mutationFn: async (body : MemberInfo) => {
      setLoading(true);
      return memberUpdate(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_UPDATE],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

}

/**
 * 회원 좋아요
 */
function useMemberLike() {
  return useMutation({
    mutationFn: async (body : MemberLike) => {
      return memberLike(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_LIKE],
      });
    },
    onSettled: () => {
    },
  });
}

// 회원 좋아요 목록 조회 (무한 스크롤)
function useMemberLikeListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => memberLikeList({ ...searchParams }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_LIKE_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: (lastPage) => {
      if (!lastPage.paging) return undefined;
      const { page_no, page_size, total_count } = lastPage.paging;
      const isLast = (page_no + 1) * page_size >= total_count;
      return isLast ? undefined : page_no + 1;
    },
  });
  
  // 데이터만 담은 result 객체
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];

  return { ...query, results };
}

export { useMemberDetail, useMemberUpdate, useMemberLike, useMemberLikeListPaging }
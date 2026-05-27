import { QUERY_KEYS } from '@/constants';
import { useLoading } from '@/contexts/LoadingContext';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { memberApplyGroupList, memberApplyList, memberApplyMeetList, memberDetail, memberLike, memberLikeList, memberMyGroupList, memberMyMeetList, memberUpdate, pushTest } from '@/api/member';
import { getNextPageParamFromPaging, printDebugLog } from '@/utils/commUtil';
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
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 신청/등록된 소셜링/클럽 목록 조회
function useMemberApplyList({target_id, target_type, use_stat}: {target_id: number, target_type: string, use_stat: string}) {
  const query = useQuery({
    queryFn: () => memberApplyList({ target_id, target_type, use_stat }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_APPLY_LIST, { target_id, target_type, use_stat }],
    enabled: target_id > 0 && !!target_type,
  });
  const results = query.data?.data ?? [];
  return { ...query, results };
}

// 내가 만든 소셜링 목록 조회 (무한 스크롤)
function useMemberMyMeetListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => memberMyMeetList({ ...searchParams }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_MY_MEET_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 신청한 소셜링 목록 조회 (무한 스크롤)
function useMemberApplyMeetListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => memberApplyMeetList({ ...searchParams }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_APPLY_MEET_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 만든 클럽 목록 조회 (무한 스크롤)
function useMemberMyGroupListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => memberMyGroupList({ ...searchParams }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_MY_GROUP_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 신청한 클럽 목록 조회 (무한 스크롤)
function useMemberApplyGroupListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => memberApplyGroupList({ ...searchParams }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_APPLY_GROUP_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

/**
 * 푸시 테스트
 */
function usePushTest({ push_title, push_message }: { push_title: string, push_message: string }) {
  return useMutation({
    mutationFn: async () => {
      return pushTest({ push_title, push_message });
    },
    onSuccess: () => {
    },
    onSettled: () => {
    },
  });
}

export { useMemberDetail, useMemberUpdate, useMemberLike, useMemberLikeListPaging, useMemberApplyList, useMemberMyMeetListPaging, useMemberApplyMeetListPaging, useMemberMyGroupListPaging, useMemberApplyGroupListPaging, usePushTest }
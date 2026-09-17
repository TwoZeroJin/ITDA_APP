import { QUERY_KEYS } from '@/constants';
import { useLoading } from '@/contexts/LoadingContext';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { memberApplyGroupList, memberProfileDetail, memberApplyList, memberApplyMeetList, memberDetail, memberLike, memberLikeList, memberMyGroupList, memberMyMeetList, memberUpdate, memberWithdrawal, memberAllGroupList } from '@/api/member';
import { getNextPageParamFromPaging } from '@/utils/commUtil';
import { MemberInfo, MemberLike, SearchParams } from '@/types';
import queryClient from '@/api/queryClient';
import { useAuth } from './useAuth';
import { showToast } from '@/utils/commToast';

/**
 * 회원 상세 정보 조회 (다가올 모임, 모임 내역, 후기 목록)
 */
function useMemberDetail() {
    const { setLoading } = useLoading();
    const query = useQuery({
        queryFn: memberDetail,
        queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_DETAIL],
    });

    useEffect(() => {
        setLoading(query.isFetching);
    }, [query.isFetching, setLoading]);

    return {
        ...query,
        upcomingMeetList    : query.data?.data?.upcoming_meet_list ?? [],
        myMeetList          : query.data?.data?.my_meet_list ?? [],
        applyMeetList       : query.data?.data?.apply_meet_list ?? [],
        myGroupList         : query.data?.data?.my_group_list ?? [],
        applyGroupList      : query.data?.data?.apply_group_list ?? [],
        reviewList          : query.data?.data?.review_list ?? [],
    };
}


/**
 * 회원 프로필 팝업 상세 조회
 * profile/detail
 */
function useProfileDetailView(body: MemberInfo) {
  const { setLoading } = useLoading();
  const query = useQuery({
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_PROFILE_DETAIL, body],
    queryFn: () => memberProfileDetail(body)
  });  

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching, setLoading]);

  const results = query.data?.data;

  return { ...query, results };    
}

/**
 * 회원 정보 수정
 */
function useMemberUpdate() {
  return useMutation({
    mutationFn: async (body : MemberInfo) => {
      return memberUpdate(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_UPDATE],
      });
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
  });
}

// 회원 좋아요 목록 조회 (무한 스크롤)
function useMemberLikeListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => memberLikeList({ ...searchParams, page_no: pageParam }),
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
function useMemberMyMeetListPaging(searchParams: SearchParams, options?: { enabled?: boolean }) {
  const { enabled = true } = options ?? {};
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => memberMyMeetList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_MY_MEET_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
    enabled,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 신청한 소셜링 목록 조회 (무한 스크롤)
function useMemberApplyMeetListPaging(searchParams: SearchParams, options?: { enabled?: boolean }) {
  const { enabled = true } = options ?? {};
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => memberApplyMeetList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_APPLY_MEET_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
    enabled,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 만든 클럽 목록 조회 (무한 스크롤)
function useMemberMyGroupListPaging(searchParams: SearchParams, options?: { enabled?: boolean }) {
  const { enabled = true } = options ?? {};
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => memberMyGroupList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_MY_GROUP_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
    enabled,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 신청한 클럽 목록 조회 (무한 스크롤)
function useMemberApplyGroupListPaging(searchParams: SearchParams, options?: { enabled?: boolean }  ) {
  const { enabled = true } = options ?? {};
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => memberApplyGroupList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_APPLY_GROUP_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
    enabled,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 내가 속한 모든 클럽 목록 조회 (무한 스크롤)
function useMemberAllGroupListPaging(searchParams: SearchParams, options?: { enabled?: boolean }  ) {
  const { enabled = true } = options ?? {};
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => memberAllGroupList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_ALL_GROUP_LIST, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
    enabled,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

/**
 * 회원 탈퇴
 */
function useMemberWithdrawl() {
  const { setLoading } = useLoading();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      return memberWithdrawal();
    },
    onSuccess: async () => {
      await logout();
      showToast({ text1: '정상적으로 회원탈퇴 되었습니다.' });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useMemberDetail, useProfileDetailView, useMemberUpdate, useMemberLike, useMemberLikeListPaging, useMemberApplyList, useMemberMyMeetListPaging, useMemberApplyMeetListPaging, useMemberMyGroupListPaging, useMemberApplyGroupListPaging, useMemberWithdrawl, useMemberAllGroupListPaging }
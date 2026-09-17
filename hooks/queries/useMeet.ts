import { meetApply, meetInsert, meetList, meetMemberList, meetView, meetConfirm, meetCancelApply, meetUpdate, meetDelete } from "@/api/meet";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { MeetApply, MeetInfo, SearchParams } from "@/types";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// 모임 목록 조회 (무한 스크롤)
function useMeetListPaging(searchParams: SearchParams, options?: { enabled?: boolean }) {
  const { enabled = true } = options ?? {};
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => meetList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
    enabled,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 모임 상세 조회
function useMeetDetailView(meetId: number) {
  const { setLoading } = useLoading();
  const query = useQuery({
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_VIEW, meetId],
    queryFn: () => meetView(meetId),
  });  

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching, setLoading]);

  const results = query.data?.data;

  return { ...query, results };    
}

// 모임 생성
function useMeetInsert() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetInfo) => {
      setLoading(true);
      return meetInsert(body);
    },
    onSuccess: (result) => {
      if (result?.ret_code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_DETAIL],
        });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 모임 수정
function useMeetUpdate() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetInfo) => {
      setLoading(true);
      return meetUpdate(body);
    },
    onSuccess: (result) => {
      if (result?.ret_code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_DETAIL],
        });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 모임 삭제
function useMeetDelete() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (meetId: number) => {
      setLoading(true);
      return meetDelete(meetId);
    },
    onSuccess: (result) => {
      if (result?.ret_code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_DETAIL],
        });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 소셜링에 참여하는 멤버 조회
function useMeetMemberList(meetId: number) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_MEMBER_LIST, meetId],
    queryFn: () => meetMemberList(meetId),
  });  
  const results = query.data?.data;

  return { ...query, results };    
}

// 소셜링 신청
function useMeetApply() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetApply) => {
      setLoading(true);
      return meetApply(body);
    },
    onSuccess: (result) => {
      if (result?.ret_code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_APPLY],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_DETAIL],
        });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}


// 소셜링 신청 취소
function useMeetCancelApply() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetApply) => {
      setLoading(true);
      return meetCancelApply(body);
    },
    onSuccess: (result) => {
      if (result?.ret_code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_CANCEL_APPLY],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER, QUERY_KEYS.MEMBER_DETAIL],
        });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 소셜링 승인
function useMeetConfirm() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetApply) => {
      setLoading(true);
      return meetConfirm(body);
    },
    onSuccess: (result) => {
      if (result?.ret_code == 200) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_CONFIRM],
        });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useMeetListPaging, useMeetInsert, useMeetUpdate, useMeetDelete, useMeetDetailView, useMeetMemberList, useMeetApply, useMeetCancelApply, useMeetConfirm };
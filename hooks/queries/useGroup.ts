import { groupCancelApply, groupApply, groupDelete, groupInsert, groupList, groupMemberList, groupView, groupUpdate, groupConfirm } from "@/api/group";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { GroupApply, GroupInfo, SearchParams } from "@/types";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// 클럽 목록 조회 (무한 스크롤)
function useGroupListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => groupList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_PAGING, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 클럽 상세 조회
function useGroupDetailView(groupId: number) {
  const { setLoading } = useLoading();
  const query = useQuery({
    queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_VIEW, groupId],
    queryFn: () => groupView(groupId),
  });
  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching, setLoading]);

  const results = query.data?.data;
  return { ...query, results };    
}

// 클럽 생성
function useGroupInsert() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : GroupInfo) => {
      setLoading(true);
      return groupInsert(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_INSERT],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 클럽 수정
function useGroupUpdate() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : GroupInfo) => {
      setLoading(true);
      return groupUpdate(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_UPDATE],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 클럽 삭제
function useGroupDelete() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (groupId: number) => {
      setLoading(true);
      return groupDelete(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_DELETE],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 소모임에 참여하는 멤버 조회
function useGroupMemberList(groupId: number) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_MEMBER_LIST, groupId],
    queryFn: () => groupMemberList(groupId),
  });
  const results = query.data?.data;
  return { ...query, results };    
}

// 그룹 신청
function useGroupApply() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : GroupApply) => {
      setLoading(true);
      return groupApply(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_APPLY],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 그룹 신청 취소
function useGroupCancelApply() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : GroupApply) => {
      setLoading(true);
      return groupCancelApply(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_CANCEL_APPLY],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 클럽 승인
function useGroupConfirm() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : GroupApply) => {
      setLoading(true);
      return groupConfirm(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_CONFIRM],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useGroupListPaging, useGroupDetailView, useGroupInsert, useGroupUpdate, useGroupDelete, useGroupMemberList, useGroupApply, useGroupCancelApply, useGroupConfirm };
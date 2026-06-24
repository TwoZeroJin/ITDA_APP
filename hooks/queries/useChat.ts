import { chatDelete, chatExit, chatInsert, chatList, chatMemberList, chatRoomList } from "@/api/chat";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * 채팅방 룸 조회
 */
function useChatRoomListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => chatRoomList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_PAGING, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = useMemo(() => query.data?.pages.flatMap(page => page.data ?? []) ?? [], [query.data]);
  return { ...query, results };
}

/**
 * 채팅방 메시지 조회
 */
function useChatListPaging(searchParams: SearchParams & { room_id: string }) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => chatList({ ...searchParams, page_no: pageParam, room_id: searchParams.room_id }),
    queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_LIST, searchParams, searchParams.room_id],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

/**
 * 채팅 메시지 입력
 */
function useChatInsert() {
  return useMutation({
    mutationFn : chatInsert,
  });
}

/**
 * 채팅방 나가기 처리
 */
function useChatExit() {
  return useMutation({
    mutationFn : chatExit,
    onSuccess: ()=>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_PAGING],
      });
    }
  });
}

/**
 * 채팅방 삭제 처리
 */
function useChatDelete() {
  return useMutation({
    mutationFn : chatDelete,
  });
}

/**
 * 채팅 멤버 조회
 */
function useChatMemberList({ room_id }: { room_id: string }) {
  const query = useQuery({
    queryFn: () => chatMemberList({ room_id }),
    queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_MEMBER_LIST, { room_id }],
  });
  const results = query.data?.data ?? [];
  return { ...query, results };
}

export { useChatInsert, useChatExit, useChatDelete, useChatRoomListPaging, useChatListPaging, useChatMemberList };

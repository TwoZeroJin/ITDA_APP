import { chatInsert, chatList, chatMemberList, chatRoomList } from "@/api/chat";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

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
  
  // 데이터만 담은 result 객체
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];

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
  
  // 데이터만 담은 result 객체
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];

  return { ...query, results };
}

/**
 * 채팅 메시지 입력
 */
function useChatInsert() {
    return useMutation({
        mutationFn : chatInsert,
        onSuccess: ()=>{}
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

export { useChatInsert, useChatRoomListPaging, useChatListPaging, useChatMemberList };

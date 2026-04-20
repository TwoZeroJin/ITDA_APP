import { chatInsert, chatList, chatRoomList } from "@/api/chat";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

/**
 * 채팅방 룸 조회
 * @param searchParams 
 * @returns 
 */
function useChatRoomListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => chatRoomList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_PAGING, searchParams],
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

/**
 * 채팅방 메시지 조회
 * @param searchParams 
 * @returns 
 */
function useChatListPaging(searchParams: SearchParams & { room_id: string }) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      chatList({
        ...searchParams,
        page_no: pageParam,
        room_id: searchParams.room_id,
      }),
    queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_LIST, searchParams],
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

function useChatInsert() {
    return useMutation({
        mutationFn : chatInsert,
        onSuccess: ()=>{}
    });
}

export { useChatInsert, useChatRoomListPaging, useChatListPaging };

import { chatInsert, chatList } from "@/api/chat";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

function useChatListPaging(searchParams: SearchParams) {
    const query = useInfiniteQuery({
    queryFn: () => chatList({ ...searchParams }),
    queryKey: [QUERY_KEYS.CHAT, QUERY_KEYS.CHAT_PAGING, searchParams],
    initialPageParam: 1,
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

export { useChatInsert, useChatListPaging };

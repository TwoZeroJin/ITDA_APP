import { meetList } from "@/api/meet";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

function useMeetListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => meetList({ ...searchParams, page: pageParam }),
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING, searchParams],
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

export default useMeetListPaging;

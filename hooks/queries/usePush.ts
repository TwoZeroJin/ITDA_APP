import { pushList } from "@/api/push";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * 푸시 목록 페이징
 */
function usePushListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({pageParam}) => pushList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.PUSH, QUERY_KEYS.PUSH_PAGING, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

export { usePushListPaging };
import { groupInsert, groupList } from "@/api/group";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { GroupInfo, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

// 클럽 목록 조회 (무한 스크롤)
function useGroupListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => groupList({ ...searchParams }),
    queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_PAGING, searchParams],
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

export { useGroupListPaging, useGroupInsert };

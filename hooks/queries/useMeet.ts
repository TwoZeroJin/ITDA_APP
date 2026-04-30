import { meetInsert, meetList } from "@/api/meet";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { MeetInfo, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

// 모임 목록 조회 (무한 스크롤)
function useMeetListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => meetList({ ...searchParams }),
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

// 모임 생성
function useMeetCreate() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetInfo) => {
      setLoading(true);
      return meetInsert(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_CREATE],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useMeetListPaging, useMeetCreate };

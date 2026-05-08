import { noticeList, noticeView } from "@/api/notice";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { SearchParams } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// 공지 목록 조회 (무한 스크롤)
function useNoticeListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => noticeList({ ...searchParams }),
    queryKey: [QUERY_KEYS.NOTICE, QUERY_KEYS.NOTICE_PAGING, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: (lastPage) => {
      if (!lastPage.paging) return undefined;
      const { page_no, page_size, total_count } = lastPage.paging;
      const isLast = (page_no + 1) * page_size >= total_count;
      return isLast ? undefined : page_no + 1;
    },
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 공지 상세 조회
function useNoticeView(noticeId?: number) {
  const { setLoading } = useLoading();
  const query = useQuery({
    queryFn: () => noticeView(Number(noticeId)),
    queryKey: [QUERY_KEYS.NOTICE, QUERY_KEYS.NOTICE_VIEW, noticeId],
    enabled: typeof noticeId === "number",
  });

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching, setLoading]);

  return query;
}

export { useNoticeListPaging, useNoticeView };

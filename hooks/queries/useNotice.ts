import { noticeList, noticeView } from "@/api/notice";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { SearchParams } from "@/types";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// 공지 목록 조회 (무한 스크롤)
function useNoticeListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => noticeList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.NOTICE, QUERY_KEYS.NOTICE_PAGING, searchParams],
    initialPageParam: searchParams.page_no,
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 공지 상세 조회
function useNoticeView(noticeId: number) {
  const { setLoading } = useLoading();
  const query = useQuery({
    queryFn: () => noticeView(noticeId),
    queryKey: [QUERY_KEYS.NOTICE, QUERY_KEYS.NOTICE_VIEW, noticeId],
  });

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching, setLoading]);

  return query;
}

export { useNoticeListPaging, useNoticeView };
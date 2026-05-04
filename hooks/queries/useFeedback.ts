import { feedbackInsert, feedbackList, feedbackView } from "@/api/feedback";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { FeedbackData, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

// 피드백 목록 조회 (무한 스크롤)
function useFeedbackListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => feedbackList({ ...searchParams }),
    queryKey: [QUERY_KEYS.FEEDBACK, QUERY_KEYS.FEEDBACK_PAGING, searchParams],
    initialPageParam: 1,
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

// 피드백 상세 조회
function useFeedbackView() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (feedbackId : number) => {
      setLoading(true);
      return feedbackView(feedbackId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDBACK, QUERY_KEYS.FEEDBACK_VIEW],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// 피드백 생성
function useFeedbackInsert() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : FeedbackData) => {
      setLoading(true);
      return feedbackInsert(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDBACK, QUERY_KEYS.FEEDBACK_INSERT],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useFeedbackListPaging, useFeedbackInsert, useFeedbackView };

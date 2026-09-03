import { myMeetListNoReview, reviewInsert, reviewList,reviewDelete,reviewUpdate, reviewCommentList, reviewCommentInsert, reviewCommentUpdate, reviewCommentDelete } from "@/api/community"; // API 함수 임포트 경로 확인 필요
import { QUERY_KEYS } from "@/constants";
import { MeetReview, ReviewComment, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { showToast } from "@/utils/commToast";
import { useLoading } from "@/contexts/LoadingContext";
import { getNextPageParamFromPaging } from "@/utils/commUtil";
import queryClient from "@/api/queryClient";

// 후기 목록 조회 (무한 스크롤)
function useReviewList(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => reviewList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_LIST, searchParams],
    initialPageParam: searchParams.page_no, 
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 후기 등록
function useReviewInsert() {
  return useMutation({
    mutationFn: reviewInsert,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_LIST],
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

// 후기 수정
function useReviewUpdate() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetReview) => {
      setLoading(true);
      return reviewUpdate(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_LIST],
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
    onSettled: () => {
      setLoading(false);
    }
  });
}

// 리뷰 삭제
function useReviewDelete() {
  return useMutation({
    mutationFn: reviewDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_LIST],
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

// 사용자의 후기작성 가능한 모임 조회
function useMyMeetListNoReview(searchParams: SearchParams) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.MY_MEET_LIST_NO_REVIEW, searchParams],
    queryFn: () => myMeetListNoReview(searchParams),
  });  
  const results = query.data?.data ?? [];
  return { ...query, results };    
}

// 후기 댓글 목록 조회 (무한 스크롤)
function useReviewCommentList(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => reviewCommentList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_COMMENT_LIST, searchParams],
    initialPageParam: searchParams.page_no, 
    getNextPageParam: getNextPageParamFromPaging,
  });
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];
  return { ...query, results };
}

// 후기 댓글 등록
function useReviewCommentInsert() {
  return useMutation({
    mutationFn: reviewCommentInsert,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_COMMENT_LIST],
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

// 후기 댓글 수정
function useReviewCommentUpdate() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : ReviewComment) => {
      setLoading(true);
      return reviewCommentUpdate(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_COMMENT_LIST],
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
    onSettled: () => {
      setLoading(false);
    }
  });
}

// 후기 댓글 삭제
function useReviewCommentDelete() {
  return useMutation({
    mutationFn: reviewCommentDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_COMMENT_LIST],
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

export { useReviewList, useReviewInsert,useMyMeetListNoReview, useReviewCommentDelete, useReviewUpdate, useReviewCommentList, useReviewCommentInsert, useReviewCommentUpdate, useReviewDelete };
import { myMeetListNoReview, reviewInsert, reviewList,reviewDelete,reviewUpdate } from "@/api/community"; // API 함수 임포트 경로 확인 필요
import { QUERY_KEYS } from "@/constants";
import { ApiResult, MeetReview, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { showToast } from "@/utils/commToast";
import { useRouter } from "expo-router";

// 1. 후기 목록 조회 (무한 스크롤)
function useReviewList(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) => reviewList({ ...searchParams, page_no: pageParam }),
    queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.COMMUNITY_REVIEW_LIST, searchParams],
    initialPageParam: 0, 
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.paging) return undefined;
      const { page_no, page_size, total_count } = lastPage.paging;
            
      // ✅ 현재까지 불러온 양이 전체보다 작으면 다음 페이지 번호 리턴
      const isLast = page_no * page_size >= total_count;
      
      return isLast ? undefined : page_no + 1;
    },
  });

  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];

  return { ...query, results };
}

// 2. 후기 등록
function useReviewInsert() {
  const router = useRouter();

  return useMutation({
    mutationFn: reviewInsert,
    onSuccess: (result: ApiResult<MeetReview>) => {
      if (result.ret_code !== 200) {
        showToast({
          text1: result.ret_msg || '등록에 실패했습니다.'
        });
      } else {
        showToast({
          text1: '리뷰가 등록되었습니다.'
        });
        router.replace("/community");
      }
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

//3. 사용자의 후기작성 가능한 모임 조회
function useMyMeetListNoReview(searchParams: SearchParams) {

  const query = useQuery({
    queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.MY_MEET_LIST_NO_REVIEW, searchParams],
    queryFn: () => myMeetListNoReview(searchParams),
  });  
  const results = query.data?.data ?? [];

  return { ...query, results };    
}

function useReviewDelete() {
  return useMutation({
    mutationFn: reviewDelete,
    onSuccess: (result: ApiResult<MeetReview>) => {
      if (result.ret_code !== 200) {
        showToast({
          text1: result.ret_msg || '삭제에 실패했습니다.'
        });
      } else {
        showToast({
          text1: '리뷰가 삭제되었습니다.'
        });
      }
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

//4. 후기 삭제 (추가)
function useReviewUpdate() {
  const router = useRouter();

  return useMutation({
    mutationFn: reviewUpdate,
    onSuccess: (result: ApiResult<MeetReview>) => {
      if (result.ret_code !== 200) {
        showToast({
          text1: result.ret_msg || '수정에 실패했습니다.'
        });
      } else {
        showToast({
          text1: '리뷰가 수정되었습니다.'
        });
        router.replace("/community");
      }
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        text1: error.response?.data?.message || error.message || '처리 중 오류가 발생했습니다.'
      });
    },
  });
}

export { useReviewList, useReviewInsert,useMyMeetListNoReview, useReviewDelete, useReviewUpdate };
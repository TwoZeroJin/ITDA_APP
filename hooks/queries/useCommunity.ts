import { myMeetListNoReview, reviewInsert, reviewList } from "@/api/community"; // API 함수 임포트 경로 확인 필요
import { QUERY_KEYS } from "@/constants";
import { ApiResult, MeetReview, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"; // ✅ useMutation 추가
import { showToast } from "@/utils/commToast";
import { useRouter } from "expo-router"; // ✅ router 임포트 수정

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
      
//      console.log(`현재 페이지: ${page_no}, 다음 페이지 가능여부: ${!isLast}`);

//      console.log(`다음 페이지 번호: ${isLast ? undefined : page_no + 1}`);
      
      return isLast ? undefined : page_no + 1;
    },
  });

  // 데이터만 담은 result 객체
  const results = query.data?.pages.flatMap(page => page.data ?? []) ?? [];

  return { ...query, results };
}

// 2. 후기 등록
function useReviewInsert() {
  const router = useRouter(); // Hook 내부에서 선언

  return useMutation({
    mutationFn: reviewInsert,
    onSuccess: (result: ApiResult<MeetReview>) => { // ✅ API 정의에 맞게 타입 수정
      if (result.ret_code !== 200) {
        showToast({
          text1: result.ret_msg || '등록에 실패했습니다.'
        });
      } else {
        showToast({
          text1: '리뷰가 등록되었습니다.'
        });
        // ✅ 성공 시 리스트 화면으로 이동
        router.replace("/community"); // 이동할 경로 확인 필요
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
    // queryKey에 params를 넣어 조건이 바뀔 때마다 다시 조회되도록 합니다.
    queryKey: [QUERY_KEYS.COMMUNITY, QUERY_KEYS.MY_MEET_LIST_NO_REVIEW, searchParams],
    queryFn: () => myMeetListNoReview(searchParams),
  });  
  // useInfiniteQuery의 'pages' 구조가 아니므로 바로 data를 추출합니다.
  // 서버 응답 구조가 { data: [...] } 형태라면 아래와 같이 가공합니다.
  const results = query.data?.data ?? [];

  return { ...query, results };    
}

export { useReviewList, useReviewInsert,useMyMeetListNoReview };
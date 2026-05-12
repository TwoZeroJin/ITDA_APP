import { meetApply, meetInsert, meetList, meetMemberList, meetView, meetConfirm,  } from "@/api/meet";
import queryClient from "@/api/queryClient";
import { QUERY_KEYS } from "@/constants";
import { useLoading } from "@/contexts/LoadingContext";
import { MeetApply, MeetInfo, SearchParams } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

// 모임 목록 조회 (무한 스크롤)
function useMeetListPaging(searchParams: SearchParams) {
  const query = useInfiniteQuery({
    queryFn: () => meetList({ ...searchParams }),
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_PAGING, searchParams],
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

// 모임 생성
function useMeetInsert() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetInfo) => {
      setLoading(true);
      return meetInsert(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_INSERT],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

//3. 소모임 상세 조회
function useMeetDetailView(meetId: number) {

  const query = useQuery({
    // queryKey에 params를 넣어 조건이 바뀔 때마다 다시 조회되도록 합니다.
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_VIEW, meetId],
    queryFn: () => meetView(meetId),
  });  
  // useInfiniteQuery의 'pages' 구조가 아니므로 바로 data를 추출합니다.
  // 서버 응답 구조가 { data: [...] } 형태라면 아래와 같이 가공합니다.
  const results = query.data?.data;

  return { ...query, results };    
}

//3. 소모임에 참여하는 멤버 조회
function useMeetMemberList(meetId: number) {

  const query = useQuery({
    // queryKey에 params를 넣어 조건이 바뀔 때마다 다시 조회되도록 합니다.
    queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_MEMBER_LIST, meetId],
    queryFn: () => meetMemberList(meetId),
  });  
  // useInfiniteQuery의 'pages' 구조가 아니므로 바로 data를 추출합니다.
  // 서버 응답 구조가 { data: [...] } 형태라면 아래와 같이 가공합니다.
  const results = query.data?.data;

  return { ...query, results };    
}

//4.소모임 신청
function useMeetApply() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetApply) => {
      setLoading(true);
      return meetApply(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_APPLY],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}


//4.소모임 신청 취소
function useMeetNotApply() {
  const { setLoading } = useLoading();
  return useMutation({
    mutationFn: async (body : MeetApply) => {
      setLoading(true);
      return meetConfirm(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEET, QUERY_KEYS.MEET_NOT_APPLY],
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export { useMeetListPaging, useMeetInsert, useMeetDetailView, useMeetMemberList, useMeetApply, useMeetNotApply };

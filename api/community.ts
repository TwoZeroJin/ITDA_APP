import { ApiResult, MeetReview, SearchParams, MeetInfo, ReviewComment } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

// 후기 목록
async function reviewList(searchParams: SearchParams): Promise<ApiResult<MeetReview[]>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_LIST, searchParams);
  return data;
}
// 후기 올리기
async function reviewInsert(body: MeetReview): Promise<ApiResult<MeetReview>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_INSERT, body);
  return data;
}
// 후기 수정 (추가)
async function reviewUpdate(body: MeetReview): Promise<ApiResult<MeetReview>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_UPDATE, body);
  return data;
}
// 후기 삭제 (추가)
async function reviewDelete(body: MeetReview): Promise<ApiResult<MeetReview>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_DELETE, body);
  return data;
}
// 사용자가 후기 작성 가능한 신청한 모임 조회
async function myMeetListNoReview(searchParams: SearchParams): Promise<ApiResult<MeetInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.MY_MEET_LIST_NO_REVIEW, searchParams);
  return data;
} 
//후기 댓글 목록
async function reviewCommentList(searchParams: SearchParams): Promise<ApiResult<ReviewComment[]>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_COMMENT_LIST, searchParams);
  return data;
}
// 후기 댓글 올리기
async function reviewCommentInsert(body: ReviewComment): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_COMMENT_INSERT, body);
  return data;
}
// 후기 댓글 수정 (추가)
async function reviewCommentUpdate(body: ReviewComment): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_COMMENT_UPDATE, body);
  return data;
}
// 후기 댓글 삭제 (추가)
async function reviewCommentDelete(body: ReviewComment): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.REVIEW_COMMENT_DELETE, body);
  return data;
}

export {reviewList, reviewInsert, myMeetListNoReview, reviewDelete, reviewUpdate, reviewCommentList, reviewCommentInsert, reviewCommentDelete, reviewCommentUpdate};
import { ApiResult, FeedbackData, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 작성한 피드백 목록 조회
 * @param searchParams 검색 조건
 * @returns 피드백 목록
 */
async function feedbackList(searchParams: SearchParams): Promise<ApiResult<FeedbackData[]>> {
  const { data } = await axiosInstance.post(API_URL.FEEDBACK_LIST, searchParams);
  return data;
}

/**
 * 피드백 조회
 * @param feedbackId 피드백 ID
 * @returns 피드백 정보
 */
async function feedbackView(feedbackId: number): Promise<ApiResult<FeedbackData>> {
  const { data } = await axiosInstance.post(API_URL.FEEDBACK_VIEW, { feedback_id : feedbackId });
  return data;
}

/**
 * 피드백 등록
 * @param body 피드백 정보
 * @returns 등록 결과
 */
async function feedbackInsert(body : FeedbackData): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.FEEDBACK_INSERT, body);
  return data;
}

export { feedbackList, feedbackView, feedbackInsert };
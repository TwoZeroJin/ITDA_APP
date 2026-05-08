import { ApiResult, MeetInfo, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

async function meetList(searchParams: SearchParams): Promise<ApiResult<MeetInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.MEET_LIST, searchParams);
  return data;
}

/**
 * 소셜링 조회
 * @param meetId 
 * @returns 소셜링 정보
 */
async function meetView(meetId: number): Promise<ApiResult<MeetInfo>> {
  const { data } = await axiosInstance.post(API_URL.MEET_VIEW, { meet_id : meetId });
  return data;
}

/**
 * 소셜링 등록
 * @param body 소셜링 정보
 * @returns 
 */
async function meetInsert(body : MeetInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.MEET_INSERT, body);
  return data;
}

/**
 * 소셜링 수정
 * @param body 소셜링 정보
 * @returns 
 */
async function meetUpdate(body : MeetInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.MEET_UPDATE, body);
  return data;
}

/**
 * 소셜링 삭제
 * @param meetId 소셜링 ID
 * @returns 
 */
async function meetDelete(meetId: number): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.MEET_DELETE, { meet_id : meetId });
  return data;
}

/**
 * 소셜링 신청
 * @returns 
 */
async function meetApply(): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.MEET_APPLY);
  return data;
}

/**
 * 소셜링 신청 승인
 * @returns 
 */
async function meetConfirm(): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.MEET_CONFIRM);
  return data;
}

export { meetList, meetView, meetInsert, meetUpdate, meetDelete, meetApply, meetConfirm };
import { ApiResult, PushData, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 푸시 목록 리스트 조회
 */
async function pushList(searchParams: SearchParams): Promise<ApiResult<PushData[]>> {
  const { data } = await axiosInstance.post(API_URL.PUSH_LIST, searchParams);
  return data;
}

export { pushList };
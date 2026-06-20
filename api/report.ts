import { ApiResult, Report } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 신고 등록
 */
async function reportInsert(body : Report): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.REPORT_INSERT, body);
  return data;
}

/**
 * 차단 등록
 */
async function reportBlock(body: Report): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.REPORT_BLOCK, body);
  return data;
}

export { reportInsert, reportBlock };
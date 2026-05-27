import { ApiResult, AppData, MainData } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 앱 초기 데이터 조회
 */
async function mainEntry(): Promise<ApiResult<AppData>> {
  const { data } = await axiosInstance.post(API_URL.MAIN_ENTRY);
  return data;
}

/**
 * 메인화면 데이터 조회
 */
async function mainData(): Promise<ApiResult<MainData>> {
  const { data } = await axiosInstance.post(API_URL.MAIN_DATA);
  return data;
}

export { mainEntry, mainData };
import { ApiResult, AppData, MainData, SearchParams } from '@/types';
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
async function mainData({ sch_category, sch_text }: { sch_category?: string, sch_text?: string }): Promise<ApiResult<MainData>> {
  const { data } = await axiosInstance.post(API_URL.MAIN_DATA, { sch_category, sch_text });
  return data;
}

export { mainEntry, mainData };
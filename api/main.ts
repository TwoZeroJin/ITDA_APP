import { ApiResult, MainData } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 메인 화면 진입
 * @returns 메인 정보
 */
async function mainEntry(): Promise<ApiResult<MainData>> {
    const {data} = await axiosInstance.post(API_URL.MAIN_ENTRY);
    return data;
}

export { mainEntry };


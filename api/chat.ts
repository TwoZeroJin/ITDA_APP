import { ApiResult, ChatData } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 채팅 데이터 입력
 * @param body 채팅 데이터
 * @returns 채팅 데이터 입력 성공 여부
 */
async function chatInsert(body: ChatData): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.CHAT_INSERT, body);
    return data;
}

export { chatInsert };


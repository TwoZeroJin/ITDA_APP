import { ApiResult, ChatData, RoomData, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 채팅룸 목록 조회
 * @returns 채팅룸 목록 조회
 */
async function chatList(searchParams: SearchParams): Promise<ApiResult<RoomData[]>> {
    const { data } = await axiosInstance.post(API_URL.CHAT_LIST, searchParams);
    return data;
}

/**
 * 채팅 조회
 * @param body room_id
 * @returns 채팅룸 목록 조회
 */
async function chatView(body: RoomData): Promise<ApiResult<ChatData[]>> {
    const { data } = await axiosInstance.post(API_URL.CHAT_VIEW, body);
    return data;
}

/**
 * 채팅 데이터 입력
 * @param body 채팅 데이터
 * @returns 채팅 데이터 입력 성공 여부
 */
async function chatInsert(body: ChatData): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.CHAT_INSERT, body);
    return data;
}

export { chatList, chatView, chatInsert };


import { ApiResult, ChatData, MemberInfo, RoomData, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 채팅룸 목록 조회
 */
async function chatRoomList(searchParams: SearchParams): Promise<ApiResult<RoomData[]>> {
  const { data } = await axiosInstance.post(API_URL.CHAT_LIST, searchParams);
  return data;
}

/**
 * 채팅 조회
 * @param searchParams room_id 포함 검색 파라미터
 */
async function chatList(searchParams: SearchParams & { room_id: string }): Promise<ApiResult<ChatData[]>> {
  const { data } = await axiosInstance.post(API_URL.CHAT_VIEW, searchParams);
  return data;
}

/**
 * 채팅 멤버 조회
 * @param searchParams room_id 포함 검색 파라미터
 */
async function chatMemberList({ room_id }: { room_id: string }): Promise<ApiResult<MemberInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.CHAT_MEMBER_LIST, { room_id });
  return data;
}

/**
 * 채팅 데이터 입력
 */
async function chatInsert(body: ChatData): Promise<ApiResult<string>> {
  const { data } = await axiosInstance.post(API_URL.CHAT_INSERT, body);
  return data;
}

/**
 * 채팅방 나감처리
 */
async function chatExit(body : ChatData): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.CHAT_EXIT, body);
  return data;
}

/**
 * 채팅방 삭제처리
 */
async function chatDelete({ room_id }: { room_id: string }): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.CHAT_ROOM_DELETE, { room_id });
  return data;
}

export { chatRoomList, chatList, chatInsert, chatMemberList, chatExit, chatDelete };
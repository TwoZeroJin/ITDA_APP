import { ApiResult, LikeData, MemberDetail, MemberInfo, MemberLike, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 회원 상세 정보 조회 (다가올 모임, 참여 내역, 후기 내역 등)
 */
async function memberDetail(): Promise<ApiResult<MemberDetail>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_DETAIL);
  return data;
}

/**
 * 회원정보 수정
 */
async function memberUpdate(body: MemberInfo): Promise<ApiResult<MemberInfo>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_UPDATE, body);
  return data;
}

/**
 * 회원 좋아요
 */
async function memberLike(body: MemberLike): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_LIKE, body);
  return data;
}

/**
 * 회원 좋아요 리스트 조회
 */
async function memberLikeList(searchParams: SearchParams): Promise<ApiResult<LikeData[]>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_LIKE_LIST, searchParams);
  return data;
}

export { memberDetail, memberUpdate, memberLike, memberLikeList };
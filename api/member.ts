import { ApiResult, GroupInfo, LikeData, MeetInfo, MemberApply, MemberDetail, MemberInfo, MemberLike, SearchParams } from '@/types';
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

/**
 * 신청/등록된 소셜링/클럽 목록 조회 
 * target_id    : 소셜링/클럽 ID
 * target_type  : M : 소셜링 / G : 클럽
 * use_stat     : 0 : 신청 (승인대기) / 1 : 승인 (가입완료)
 */
async function memberApplyList({target_id, target_type, use_stat}: {target_id: number, target_type: string, use_stat: string}): Promise<ApiResult<MemberApply[]>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_APPLY_LIST, { target_id, target_type, use_stat });
  return data;
}

/**
 * 내가 만든 소셜링 목록 조회 
 */
async function memberMyMeetList(searchParams: SearchParams): Promise<ApiResult<MeetInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_MY_MEET_LIST, searchParams);
  return data;
}

/**
 * 내가 신청한 소셜링 목록 조회 
 */
async function memberApplyMeetList(searchParams: SearchParams): Promise<ApiResult<MeetInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_APPLY_MEET_LIST, searchParams);
  return data;
}

/**
 * 내가 만든 클럽 목록 조회 
 */
async function memberMyGroupList(searchParams: SearchParams): Promise<ApiResult<GroupInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_MY_GROUP_LIST, searchParams);
  return data;
}

/**
 * 내가 신청한 클럽 목록 조회 
 */
async function memberApplyGroupList(searchParams: SearchParams): Promise<ApiResult<GroupInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.MEMBER_APPLY_GROUP_LIST, searchParams);
  return data;
}

/**
 * 푸시 테스트
 */
async function pushTest({ push_title, push_message }: { push_title: string, push_message: string }): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.PUSH_INSERT, { push_title, push_message });
  return data;
}

export { memberDetail, memberUpdate, memberLike, memberLikeList, memberApplyList, memberMyMeetList, memberApplyMeetList, memberMyGroupList, memberApplyGroupList, pushTest };
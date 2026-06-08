import { ApiResult, FileInfo, GroupApply, GroupInfo, MemberInfo, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 클럽 목록 조회
 */
async function groupList(searchParams: SearchParams): Promise<ApiResult<GroupInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_LIST, searchParams);
  return data;
}

/**
 * 클럽 상세 정보 조회
 * @param groupId 
 */
async function groupView(groupId: number): Promise<ApiResult<GroupInfo & { img_list?: FileInfo[] }>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_VIEW, { group_id : groupId });
  return data;
}

/**
 * 클럽 등록
 */
async function groupInsert(body : GroupInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_INSERT, body);
  return data;
}

/**
 * 클럽 수정
 */
async function groupUpdate(body : GroupInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_UPDATE, body);
  return data;
}

/**
 * 클럽 삭제
 * @param groupId 
 */
async function groupDelete(groupId: number): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_DELETE, { group_id : groupId });
  return data;
}

/**
 * 클럽 신청
 */
async function groupApply(body: GroupApply): Promise<ApiResult<GroupApply>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_APPLY, body);
  return data;
}

/**
 * 클럽 신청 취소
 */
async function groupCancelApply(body: GroupApply): Promise<ApiResult<GroupApply>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_CANCEL_APPLY, body);
  return data;
}

/**
 * 클럽 신청 승인
 */
async function groupConfirm(body: GroupApply): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_CONFIRM, body);
  return data;
}

async function groupMemberList(groupId: number): Promise<ApiResult<MemberInfo[]>> {
    const { data } = await axiosInstance.post(API_URL.GROUP_MEMBER_LIST, { group_id : groupId });
    return data;
}


export { groupList, groupView, groupInsert, groupUpdate, groupDelete, groupApply, groupCancelApply, groupConfirm, groupMemberList };
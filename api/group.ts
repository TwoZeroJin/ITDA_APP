import { ApiResult, GroupInfo, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

async function groupList(searchParams: SearchParams): Promise<ApiResult<GroupInfo[]>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_LIST, searchParams);
  return data;
}

async function groupView(groupId: number): Promise<ApiResult<GroupInfo>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_VIEW, { group_id : groupId });
  return data;
}

async function groupInsert(body : GroupInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_INSERT, body);
  return data;
}

async function groupUpdate(body : GroupInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_UPDATE, body);
  return data;
}

async function groupDelete(groupId: number): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_DELETE, { group_id : groupId });
  return data;
}

async function groupApply(): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_APPLY);
  return data;
}

async function groupConfirm(): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.GROUP_CONFIRM);
  return data;
}

export { groupList, groupView, groupInsert, groupUpdate, groupDelete, groupApply, groupConfirm };
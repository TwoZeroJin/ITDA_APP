import { ApiResult, GroupInfo, SearchParams } from '@/types';
import axiosInstance from './axios';

async function groupList(searchParams: SearchParams): Promise<ApiResult<GroupInfo[]>> {
    const {data} = await axiosInstance.post('/group/list', searchParams);
    return data;
}

async function groupView(groupId: number): Promise<ApiResult<GroupInfo>> {
    const { data } = await axiosInstance.post('/group/view', { group_id : groupId });
    return data;
}

async function groupInsert(body : GroupInfo): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post('/group/insert', body);
    return data;
}

async function groupUpdate(body : GroupInfo): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post('/group/update', body);
    return data;
}

async function groupDelete(groupId: number): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post('/group/delete', { group_id : groupId });
    return data;
}

async function groupApply(): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post('/group/apply');
    return data;
}

async function groupConfirm(): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post('/group/confirm');
    return data;
}

export { groupList, groupView, groupInsert, groupUpdate, groupDelete, groupApply, groupConfirm };


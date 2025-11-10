import { ApiResult, MeetInfo, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

async function meetList(searchParams: SearchParams): Promise<ApiResult<MeetInfo[]>> {
    const {data} = await axiosInstance.post(API_URL.MEET_LIST, searchParams);
    return data;
}

async function meetView(meetId: number): Promise<ApiResult<MeetInfo>> {
    const { data } = await axiosInstance.post(API_URL.MEET_VIEW, { meet_id : meetId });
    return data;
}

async function meetInsert(body : MeetInfo): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.MEET_INSERT, body);
    return data;
}

async function meetUpdate(body : MeetInfo): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.MEET_UPDATE, body);
    return data;
}

async function meetDelete(meetId: number): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.MEET_DELETE, { meet_id : meetId });
    return data;
}

async function meetApply(): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.MEET_APPLY);
    return data;
}

async function meetConfirm(): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post(API_URL.MEET_CONFIRM);
    return data;
}

export { meetList, meetView, meetInsert, meetUpdate, meetDelete, meetApply, meetConfirm };


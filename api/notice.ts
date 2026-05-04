import { ApiResult, BoardNotice, SearchParams } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 공지사항 목록 조회
 * @param searchParams 검색 조건
 * @returns 공지사항 목록
 */
async function noticeList(searchParams: SearchParams): Promise<ApiResult<BoardNotice[]>> {
    const { data } = await axiosInstance.post(API_URL.NOTICE_LIST, searchParams);
    return data;
}

/**
 * 공지사항 조회
 * @param noticeId 공지사항 ID
 * @returns 공지사항 정보
 */
async function noticeView(noticeId: number): Promise<ApiResult<BoardNotice>> {
    const { data } = await axiosInstance.post(API_URL.NOTICE_VIEW, { notice_id : noticeId });
    return data;
}

export { noticeList, noticeView };
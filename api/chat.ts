import { ApiResult, ChatData } from '@/types';
import axiosInstance from './axios';

async function chatInsert(body: ChatData): Promise<ApiResult<null>> {
    const { data } = await axiosInstance.post('/chat/insert', body);
    return data;
}

export { chatInsert };


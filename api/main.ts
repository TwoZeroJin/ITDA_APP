import { ApiResult, MainData } from '@/types';
import axiosInstance from './axios';

async function mainEntry(): Promise<ApiResult<MainData>> {
    const {data} = await axiosInstance.post('/main/entry');
    return data;
}

export { mainEntry };


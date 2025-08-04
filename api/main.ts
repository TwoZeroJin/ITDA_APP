import { ApiResult } from '@/types';
import axiosInstance from './axios';

async function mainEntry(): Promise<ApiResult<{}>> {
    const {data} = await axiosInstance.post('/main/entry');

    return data;
}

export { mainEntry };


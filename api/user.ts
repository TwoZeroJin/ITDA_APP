import { ApiResult, MemberInfo, SignupInfo, Token, User } from '@/types';
import axiosInstance from './axios';

async function userSignup(body: SignupInfo): Promise<ApiResult<null>> {
    const {data} = await axiosInstance.post('/user/signup', body);

    return data;
}

// async function userLogin(body: User & {expoPushToken?: string}): Promise<{accessToken: string}> {
async function userLogin(body: User): Promise<ApiResult<MemberInfo & Token>> {
    const {data} = await axiosInstance.post('/user/login', body);

    return data;
}

async function userAutoLogin(id: number): Promise<ApiResult<MemberInfo & Token>> {
    const { data } = await axiosInstance.post('/user/auto_login');
    return data;
}

export { userAutoLogin, userLogin, userSignup };


import { MemberInfo, SignupInfo, User } from '@/types';
import axiosInstance from './axios';

async function userSignup(body: SignupInfo): Promise<void> {
    const {data} = await axiosInstance.post('/user/signup', body);

    return data;
}

async function userLogin(body: User & {expoPushToken?: string}): Promise<{accessToken: string}> {
    const {data} = await axiosInstance.post('/user/login', body);

    return data;
}

async function userAutoLogin(id: number): Promise<MemberInfo> {
    const { data } = await axiosInstance.post('/user/auto_login');
    return data;
}

export { userAutoLogin, userLogin, userSignup };


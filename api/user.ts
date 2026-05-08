import { ApiResult, MemberInfo, SignupInfo, Token, User } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 회원가입
 * @param body 회원가입 정보
 * @returns 회원가입 성공 여부
 */
async function userSignup(body: SignupInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.USER_SIGNUP, body);
  return data;
}

/**
 * 로그인
 * @param body 로그인 정보
 * @returns 회원 정보 및 토큰
 */
// async function userLogin(body: User & {expoPushToken?: string}): Promise<{accessToken: string}> {
async function userLogin(body: User): Promise<ApiResult<MemberInfo & Token>> {
  const { data } = await axiosInstance.post(API_URL.USER_LOGIN, body);
  return data;
}

/**
 * 자동 로그인
 * @returns 회원 정보 및 토큰
 */
async function userAutoLogin(): Promise<ApiResult<MemberInfo & Token>> {
  const { data } = await axiosInstance.post(API_URL.USER_AUTO_LOGIN);
  return data;
}

/**
 * 토큰 갱신
 * @returns 새로운 토큰 정보
 */
async function userRefreshToken(): Promise<ApiResult<Token>> {
  const { data } = await axiosInstance.post(API_URL.USER_REFRESH_TOKEN);
  return data;
}

export { userAutoLogin, userLogin, userSignup, userRefreshToken };
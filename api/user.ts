import { ApiResult, MemberInfo, SignupInfo, Token, User } from '@/types';
import axiosInstance from './axios';
import { API_URL } from '@/constants';

/**
 * 회원가입
 */
async function userSignup(body: SignupInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.USER_SIGNUP, body);
  return data;
}

/**
 * 로그인
 */
async function userLogin(body: User): Promise<ApiResult<MemberInfo & Token>> {
  const { data } = await axiosInstance.post(API_URL.USER_LOGIN, body);
  return data;
}

/**
 * 자동 로그인
 */
async function userAutoLogin(): Promise<ApiResult<MemberInfo & Token>> {
  const { data } = await axiosInstance.post(API_URL.USER_AUTO_LOGIN);
  return data;
}

/**
 * 아이디 찾기 (이름, 이메일 입력, SNS로그인일 경우 후 처리)
 */
async function userFindId(body: MemberInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.USER_FIND_ID, body);
  return data;
}

/**
 * 비밀번호 찾기 (이름, 이메일, 로그인 ID 입력, Email로 전송 SNS로그인일 경우 후 처리)
 */
async function userFindPwd(body: MemberInfo): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.USER_FIND_PWD, body);
  return data;
}

/**
 * 인증 코드 검증 (이메일로 전송된 인증 코드 검증, 서버에서 RequestParam으로 받음)
 */
async function userVerifyCode(verifyCode: string): Promise<ApiResult<{ mem_id: number }>> {
  const { data } = await axiosInstance.post(API_URL.USER_VERIFY_CODE, null, { params: { verify_code: verifyCode } });
  return data;
}

/**
 * 비밀번호 변경 (인증 코드 검증 후 받은 mem_id, 새 비밀번호 입력으로 업데이트)
 */
async function userUpdatePwd(body: MemberInfo & { login_pwd: string }): Promise<ApiResult<null>> {
  const { data } = await axiosInstance.post(API_URL.USER_UPDATE_PWD, body);
  return data;
}

/**
 * 토큰 갱신
 */
async function userRefreshToken(): Promise<ApiResult<Token>> {
  const { data } = await axiosInstance.post(API_URL.USER_REFRESH_TOKEN);
  return data;
}

export { userAutoLogin, userLogin, userSignup, userFindId, userFindPwd, userVerifyCode, userUpdatePwd, userRefreshToken };
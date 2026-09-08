import { API_URL, STORE_KEY } from "@/constants";
import { ApiResult, Token } from "@/types";
import { getAccessToken, getClientId, getRefreshToken, printInfoLog } from "@/utils/commUtil";
import { logoutUser } from "@/utils/authUtil";
import { saveSecureStore } from "@/utils/secureStoreUtil";
import axios from "axios";
import { showToast } from "@/utils/commToast";

/**
 * Axios instance 설정
 */
const axiosInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_KEY}`,
  timeout: 30000, // 타임아웃 30초
  headers: {
    'x-client-id' : getClientId(),
  }
});

// 토큰 갱신 진행 상태 및 갱신 완료를 기다리는 요청들
let isRefreshing = false;
let refreshSubscribers: Array<(accessToken: string) => void> = [];

function subscribeTokenRefresh(callback: (accessToken: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(accessToken: string) {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
}

/**
 * Request 인터셉터 설정
 * Token 설정
 */
axiosInstance.interceptors.request.use(async (config) => {
  const access_token  = await getAccessToken();
  const refresh_token = await getRefreshToken();

  config.headers[STORE_KEY.X_ACCESS_TOKEN] = access_token;
  config.headers[STORE_KEY.X_REFRESH_TOKEN] = refresh_token;

  if (config.data) {
    printInfoLog('[API Request] :', JSON.stringify({
      url   : `${config.baseURL}${config.url}`,
      data  : config.data
    }));
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Response 인터셉터 설정
 */
axiosInstance.interceptors.response.use(
  response => {
    printInfoLog('[API Response] :', JSON.stringify({
      url     : `${response.config.baseURL}${response.config.url}`,
      status  : response.status,
      data    : response.data
    }));
    return response;
  },
  error => {
    const originalRequest = error.config;

    // 네트워크 에러
    if (!error.response) {
      // printErrorLog('[API Error - Network] :', JSON.stringify(error));
      printInfoLog('[API Error - Network] :', JSON.stringify(error));
      return Promise.reject(error);
    }

    // 서버 응답 에러
    // printErrorLog('[API Error - Response] :', JSON.stringify({
    printInfoLog('[API Error - Response] :', JSON.stringify({
      url     : `${error.config.baseURL}${error.config.url}`,
      status  : error.response.status,
      data    : error.response.data
    }));

    if (error.response.status === 401) {
      // 토큰 갱신 요청 자체가 401인 경우 또는 이미 재시도한 요청인 경우 바로 로그아웃 처리
      if (originalRequest?.url === API_URL.USER_REFRESH_TOKEN || originalRequest?._retry) {
        showToast({ text1: '로그인 상태가 만료되었습니다.\n 다시 로그인해주세요.' });
        logoutUser();
        return Promise.reject(error);
      }

      // 이미 다른 요청이 토큰 갱신 중이면, 갱신 완료 후 재요청하도록 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newAccessToken) => {
            if (!newAccessToken) {
              reject(error);
              return;
            }
            originalRequest._retry = true;
            originalRequest.headers[STORE_KEY.X_ACCESS_TOKEN] = newAccessToken;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return (async () => {
        try {
          const { data }: { data: ApiResult<Token> } = await axiosInstance.post(API_URL.USER_REFRESH_TOKEN);

          if (data.ret_code === 200 && data.data) {
            await saveSecureStore(STORE_KEY.X_ACCESS_TOKEN, data.data.access_token);
            await saveSecureStore(STORE_KEY.X_REFRESH_TOKEN, data.data.refresh_token);
            onTokenRefreshed(data.data.access_token);

            originalRequest.headers[STORE_KEY.X_ACCESS_TOKEN] = data.data.access_token;
            return axiosInstance(originalRequest);
          }
          showToast({ text1: '로그인 상태가 만료되었습니다.\n 다시 로그인해주세요.' });
        } finally {
          onTokenRefreshed('');
          await logoutUser();
          isRefreshing = false;
          return Promise.resolve();
        }
      })();
    }

    return Promise.resolve();
  }
);

export default axiosInstance;
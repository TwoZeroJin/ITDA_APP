import { QUERY_KEYS, STORE_KEY } from "@/constants";
import { getAccessToken, getClientId, getRefreshToken, printErrorLog, printInfoLog } from "@/utils/commUtil";
import { deleteSecureStore } from "@/utils/secureStoreUtil";
import axios from "axios";
import { router } from "expo-router";
import queryClient from "./queryClient";

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
    // 네트워크 에러
    if (!error.response) {
      // printErrorLog('[API Error - Network] :', JSON.stringify(error));
      printInfoLog('[API Error - Network] :', JSON.stringify(error));
    } 
    // 서버 응답 에러
    else {
      // printErrorLog('[API Error - Response] :', JSON.stringify({
      printInfoLog('[API Error - Response] :', JSON.stringify({
        url     : `${error.config.baseURL}${error.config.url}`,
        status  : error.response.status,
        data    : error.response.data
      }));
      if (error.response.status === 401) {
        // 토큰 만료 등 인증 에러 처리 로직 추가 가능
        deleteSecureStore(STORE_KEY.X_ACCESS_TOKEN);
        deleteSecureStore(STORE_KEY.X_REFRESH_TOKEN);
        queryClient.resetQueries({ queryKey: [QUERY_KEYS.USER]});
        router.replace("/" as any);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
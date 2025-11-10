import { STORE_KEY } from "@/constants";
import { getAccessToken, getClientId, getRefreshToken, printErrorLog, printInfoLog } from "@/utils/commUtil";
import axios from "axios";

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
        printErrorLog('[API Error - Network] :', JSON.stringify(error));
      } 
      // 서버 응답 에러
      else {
        printErrorLog('[API Error - Response] :', JSON.stringify({
            url     : `${error.config.baseURL}${error.config.url}`,
            status  : error.response.status,
            data    : error.response.data
        }));
      }

      return Promise.reject(error);
    }
  );

export default axiosInstance;
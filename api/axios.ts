
import { STORE_KEY } from "@/constants";
import { getClientId } from "@/utils/base64Util";
import { getAccessToken, getRefreshToken } from "@/utils/commUtil";
import axios from "axios";

/**
 * Axios instance 설정
 */
const axiosInstance = axios.create({
    //baseURL: "http://192.168.0.38:6528/api",
    baseURL: "http://146.56.105.2:6528/api",
    headers: {
        'x-client-id' : getClientId(),
    }
});

// Token 설정
axiosInstance.interceptors.request.use(async (config) => {
    const access_token  = await getAccessToken();
    const refresh_token = await getRefreshToken();

    config.headers[STORE_KEY.X_ACCESS_TOKEN] = access_token;
    config.headers[STORE_KEY.X_REFRESH_TOKEN] = refresh_token;

    if (config.data) {
        console.log('[API Request]', config.data);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    response => {
        console.log('[API Response]', {
            url     : response.config.url,
            status  : response.status,
            data    : response.data
        });
      return response;
    },
    error => {
      // 네트워크 에러
      if (!error.response) {
        console.error('[API Error - Network]', error.message);
      } 
      // 서버 응답 에러
      else {
        console.error('[API Error - Response]', {
            url     : error.config.url,
            status  : error.response.status,
            data    : error.response.data
        });
      }

      return Promise.reject(error);
    }
  );

export default axiosInstance;
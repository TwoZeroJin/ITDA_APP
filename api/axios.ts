
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

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
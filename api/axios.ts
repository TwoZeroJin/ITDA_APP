import axios from "axios";

/**
 * Axios instance 설정
 */
const axiosInstance = axios.create({
    // baseURL: Platform.OS === 'ios' ? "http://localhost:3030" : "http://10.0.2.2:3030"
    baseURL: "http://192.168.0.38:6528/api"
});

export default axiosInstance;
import axios from "axios";
import { API_URL } from './config';

export const api = axios.create({
    baseURL: API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken') || '';
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    res => res,
    async (error) => {
        console.log('error interceptor:', error);
        const originalRequest = error.config;
        if (error.status == 401 && error?.response?.data['refresh']) {
            const refreshToken = sessionStorage.getItem("refreshToken");
            const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("refreshToken", data.refreshToken);

            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
)
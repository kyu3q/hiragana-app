import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getAuthToken } from './authService';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// リクエストインターセプター
client.interceptors.request.use(
    config => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
client.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // 認証エラーイベントを発火
            window.dispatchEvent(new Event('auth-error'));
        }
        return Promise.reject(error);
    }
);

export default client; 
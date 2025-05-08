import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // バックエンドのURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストのインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // リクエスト送信前の処理
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスのインターセプター
apiClient.interceptors.response.use(
  (response) => {
    // レスポンス受信後の処理
    return response;
  },
  (error) => {
    // エラー処理
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient; 
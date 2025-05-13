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
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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
    // 認証エラー（401）の場合、ローカルストレージをクリア
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    }
    
    // エラー処理
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient; 
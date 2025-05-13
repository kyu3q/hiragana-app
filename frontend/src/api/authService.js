import apiClient from './client';

// ユーザー登録
export const register = async (email, nickname, password) => {
  try {
    const response = await apiClient.post('/api/users', {
      email,
      username: nickname, // バックエンドではusernameフィールドを使用
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || '登録に失敗しました';
  }
};

// ログイン
export const login = async (email, password) => {
  try {
    // バックエンドに対応するAPIエンドポイントがない場合は修正が必要
    const response = await apiClient.post('/api/auth/login', {
      email,
      password
    });
    
    // トークンがレスポンスに含まれる場合は保存
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'ログインに失敗しました';
  }
};

// ログアウト
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
};

// 現在のユーザー情報を取得
export const getCurrentUser = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;
  
  return apiClient.get(`/api/users/${userId}`)
    .then(response => response.data)
    .catch(() => {
      logout(); // エラーの場合はログアウト処理
      return null;
    });
};

// トークンの取得（リクエストインターセプターで使用可能）
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// ログイン状態のチェック
export const isLoggedIn = () => {
  return !!localStorage.getItem('authToken');
}; 
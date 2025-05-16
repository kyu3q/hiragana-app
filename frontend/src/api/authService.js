import apiClient from './client';

// ユーザー登録
export const register = async (email, nickname, password) => {
  try {
    console.log('Registering user:', { email, nickname, password });
    const response = await apiClient.post('/api/users', {
      email,
      username: nickname,
      password
    });
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error);
    throw error.response?.data || error.message || '登録に失敗しました';
  }
};

// ログイン
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    if (!token || !user) {
      throw new Error('ログインに失敗しました。無効なレスポンスです。');
    }
    
    // トークンとユーザー情報を保存
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    
    // ユーザー情報を返す前に、トークンが正しく設定されているか確認
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      throw new Error('トークンの保存に失敗しました');
    }
    
    return { user };  // オブジェクトとして返す
  } catch (error) {
    console.error('Login error:', error);
    // エラー発生時にローカルストレージをクリア
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    if (error.response?.status === 401) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    } else if (error.response?.status === 404) {
      throw new Error('ユーザーが見つかりません');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message === 'Network Error') {
      throw new Error('サーバーに接続できません。ネットワーク接続を確認してください。');
    } else {
      throw new Error('ログインに失敗しました。もう一度お試しください。');
    }
  }
};

// ログアウト
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

// 現在のユーザー情報を取得
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    // トークンまたはユーザーIDが存在しない場合は、ローカルストレージをクリア
    logout();
    return null;
  }

  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    if (!response.data) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // エラーが発生した場合は、ローカルストレージをクリア
    logout();
    return null;
  }
};

// トークンの取得（リクエストインターセプターで使用可能）
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// ログイン状態のチェック
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
}; 
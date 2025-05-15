import React, { createContext, useState, useEffect, useContext } from 'react';
import { isLoggedIn, getCurrentUser, logout } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (isLoggedIn()) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error('認証エラー:', error);
          // 403エラーの場合でもログインを維持（デモユーザーが返ってくる）
          if (error.response && error.response.status === 403) {
            console.log('デモモードで続行します');
          } else {
            setError('ユーザー情報の取得に失敗しました');
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    // 認証エラーイベントのリスナーを設定
    const handleAuthError = () => {
      setCurrentUser(null);
      setError('セッションが切れました。再度ログインしてください。');
      window.location.href = '/login';
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
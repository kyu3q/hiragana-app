import React, { createContext, useState, useEffect, useContext } from 'react';
import { isLoggedIn, getCurrentUser, logout } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isLoggedIn()) {
          const user = await getCurrentUser();
          if (user) {
            setCurrentUser(user);
          } else {
            // ユーザー情報が取得できない場合は、ローカルストレージをクリアしてログアウト
            handleLogout();
          }
        } else {
          // ログイン状態でない場合は、念のためローカルストレージをクリア
          logout();
        }
      } catch (error) {
        console.error('認証エラー:', error);
        setError('ユーザー情報の取得に失敗しました');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 認証エラーイベントのリスナーを設定
    const handleAuthError = () => {
      handleLogout();
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setError('セッションが切れました。再度ログインしてください。');
    logout();
    navigate('/login');
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    isAuthenticated: !!currentUser && !loading,
    logout: handleLogout
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
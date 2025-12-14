import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-char char-1">あ</div>
        <div className="floating-char char-2">い</div>
        <div className="floating-char char-3">う</div>
        <div className="floating-char char-4">え</div>
        <div className="floating-char char-5">お</div>
      </div>
      
      <div className="auth-content-wrapper">
        <div className="auth-mascot left">
          <img src="/img/kabutomushi.png" alt="Kabutomushi" />
        </div>
        
        <div className="auth-container">
          <div className="auth-header">
            <h1>ひらがなアプリ</h1>
            <p>楽しく学ぼう！</p>
          </div>
          
          {isLogin ? (
            <LoginForm 
              onSuccess={handleAuthSuccess} 
              onRegisterClick={() => setIsLogin(false)} 
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess} 
              onLoginClick={() => setIsLogin(true)} 
            />
          )}
        </div>

        <div className="auth-mascot right">
          <img src="/img/kuwagata.png" alt="Kuwagata" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

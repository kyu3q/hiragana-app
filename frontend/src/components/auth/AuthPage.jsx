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
      <div className="auth-container">
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
    </div>
  );
};

export default AuthPage; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const LoginForm = ({ onSuccess, onRegisterClick }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userData = await login(formData.email, formData.password);
      setCurrentUser(userData.user);
      if (onSuccess) onSuccess(userData.user);
    } catch (err) {
      console.error('ログインエラー:', err);

      // メール未確認エラーをチェック
      if (err.response?.data?.needsVerification) {
        setError('メールアドレスが未確認です。確認メールをご確認ください。');
      } else {
        setError(err.message || 'ログインに失敗しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>ログイン</h2>
      
      {error && (
        <div className="error-message">
          <div>
            <p>{error}</p>
            {error.includes('ネットワーク接続') && (
              <>
                <p className="error-help">以下の点を確認してください：</p>
                <ul className="error-help-list">
                  <li>インターネット接続が安定しているか</li>
                  <li>サーバーが起動しているか</li>
                  <li>ファイアウォールの設定</li>
                </ul>
              </>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? '処理中...' : 'ログイン'}
        </button>
      </form>
      
      <div className="auth-form-footer">
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-button"
            style={{ marginBottom: '8px' }}
          >
            パスワードを忘れた方はこちら
          </button>
        </div>
        <p>アカウントをお持ちでないですか？</p>
        <button onClick={onRegisterClick} className="text-button">
          新規登録はこちら
        </button>
      </div>
    </div>
  );
};

export default LoginForm; 
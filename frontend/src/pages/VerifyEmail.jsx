import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('トークンが見つかりません。');
        return;
      }

      try {
        const response = await apiClient.post(`/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'メールアドレスが確認されました。');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
          'メールアドレスの確認に失敗しました。'
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendEmail = async () => {
    const email = prompt('メールアドレスを入力してください:');
    if (!email) return;

    try {
      await apiClient.post('/api/auth/resend-verification', { email });
      alert('確認メールを再送信しました。');
    } catch (error) {
      alert('メールの送信に失敗しました。');
    }
  };

  return (
    <div className="verify-email-page">
      {/* 背景のアニメーション */}
      <div className="verify-background">
        <div className="floating-char char-1">あ</div>
        <div className="floating-char char-2">か</div>
        <div className="floating-char char-3">さ</div>
        <div className="floating-char char-4">た</div>
        <div className="floating-char char-5">な</div>
      </div>

      {/* コンテンツ */}
      <div className="verify-content">
        <div className="verify-card">
          <h1 className="verify-title">メール確認</h1>

          {status === 'verifying' && (
            <div className="verify-status verifying">
              <div className="spinner"></div>
              <p className="status-text">確認中...</p>
              <div className="hiragana-spin">あ</div>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-status success">
              <div className="success-icon">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#4caf50" opacity="0.2"/>
                  <circle cx="50" cy="50" r="35" fill="#4caf50" opacity="0.4"/>
                  <path
                    d="M 30 50 L 45 65 L 70 35"
                    stroke="#fff"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="status-message">{message}</p>
              <p className="status-sub">これでログインできます！</p>
              <button
                onClick={() => navigate('/login')}
                className="verify-button primary"
              >
                ログインする
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-status error">
              <div className="error-icon">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#f44336" opacity="0.2"/>
                  <circle cx="50" cy="50" r="35" fill="#f44336" opacity="0.4"/>
                  <path
                    d="M 35 35 L 65 65 M 65 35 L 35 65"
                    stroke="#fff"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="status-message">{message}</p>
              <p className="status-sub">もう一度お試しください</p>
              <div className="button-group">
                <button
                  onClick={handleResendEmail}
                  className="verify-button primary"
                >
                  確認メールを再送信
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="verify-button secondary"
                >
                  ログイン画面に戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

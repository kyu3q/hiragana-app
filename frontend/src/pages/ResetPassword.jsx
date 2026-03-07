import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // パスワード一致チェック
    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    // パスワード長チェック（新規登録と同じ6文字以上）
    if (newPassword.length < 6) {
      setError('パスワードは6文字以上で設定してください');
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setError('トークンが見つかりません。もう一度リセットをリクエストしてください。');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'パスワードのリセットに失敗しました。もう一度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      {/* 背景のアニメーション */}
      <div className="reset-background">
        <div className="floating-char char-1">あ</div>
        <div className="floating-char char-2">か</div>
        <div className="floating-char char-3">さ</div>
        <div className="floating-char char-4">た</div>
        <div className="floating-char char-5">な</div>
      </div>

      {/* コンテンツ */}
      <div className="reset-content">
        <div className="reset-card">
          {!success ? (
            <>
              <h1 className="reset-title">パスワードリセット</h1>
              <p className="reset-subtitle">新しいパスワードを設定してください</p>

              {error && (
                <div className="error-box">
                  <div className="error-icon">⚠️</div>
                  <div className="error-text">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="reset-form">
                <div className="form-group">
                  <label htmlFor="newPassword">新しいパスワード</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="6文字以上"
                  />
                  <p className="form-hint">6文字以上で設定してください</p>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">パスワード確認</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="もう一度入力"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="reset-button primary"
                >
                  {loading ? '変更中...' : 'パスワードを変更'}
                </button>
              </form>

              <div className="reset-footer">
                <button
                  onClick={() => navigate('/login')}
                  className="text-link"
                >
                  ログイン画面に戻る
                </button>
              </div>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon-large">
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
              <h2 className="success-title">パスワードを変更しました！</h2>
              <p className="success-message">新しいパスワードでログインできます</p>
              <button
                onClick={() => navigate('/login')}
                className="reset-button primary"
              >
                ログイン画面へ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

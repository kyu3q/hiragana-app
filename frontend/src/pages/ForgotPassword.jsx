import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError('メールの送信に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* 背景のアニメーション */}
      <div className="forgot-background">
        <div className="floating-char char-1">あ</div>
        <div className="floating-char char-2">か</div>
        <div className="floating-char char-3">さ</div>
        <div className="floating-char char-4">た</div>
        <div className="floating-char char-5">な</div>
      </div>

      {/* コンテンツ */}
      <div className="forgot-content">
        <div className="forgot-card">
          {!sent ? (
            <>
              <h1 className="forgot-title">パスワードを忘れた</h1>
              <p className="forgot-subtitle">登録したメールアドレスを入力してください</p>
              <p className="forgot-description">
                パスワードリセット用のリンクをメールで送信します
              </p>

              {error && (
                <div className="error-box">
                  <div className="error-icon">⚠️</div>
                  <div className="error-text">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="forgot-form">
                <div className="form-group">
                  <label htmlFor="email">メールアドレス</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@gmail.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="forgot-button primary"
                >
                  {loading ? '送信中...' : 'リセットメールを送信'}
                </button>
              </form>

              <div className="forgot-footer">
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
                📧
              </div>
              <h2 className="success-title">メールを送信しました！</h2>
              <div className="email-display">
                <span className="email-label">送信先:</span>
                <span className="email-address">{email}</span>
              </div>
              <div className="instructions">
                <h3 className="instructions-title">次のステップ</h3>
                <ol className="instructions-list">
                  <li>受信したメールを確認してください</li>
                  <li>メール内のリンクをクリック</li>
                  <li>新しいパスワードを設定</li>
                  <li>ログインしてご利用ください</li>
                </ol>
              </div>
              <div className="notice-box">
                <div className="notice-icon">💡</div>
                <div className="notice-text">
                  メールが届かない場合は、迷惑メールフォルダもご確認ください
                </div>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="forgot-button primary"
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

export default ForgotPassword;

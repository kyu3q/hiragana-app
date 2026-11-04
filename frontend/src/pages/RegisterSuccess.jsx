import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../api/client';
import './RegisterSuccess.css';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('メールアドレスが見つかりません。ログイン画面から再送信してください。');
      return;
    }

    setResending(true);
    setResendMessage('');

    try {
      await apiClient.post('/api/auth/resend-verification', { email });
      setResendMessage('✓ 確認メールを再送信しました！');
    } catch (error) {
      setResendMessage('❌ メールの送信に失敗しました。もう一度お試しください。');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-success-page">
      {/* 背景のアニメーション */}
      <div className="success-background">
        <div className="floating-char char-1">あ</div>
        <div className="floating-char char-2">り</div>
        <div className="floating-char char-3">が</div>
        <div className="floating-char char-4">と</div>
        <div className="floating-char char-5">う</div>
      </div>

      {/* コンテンツ */}
      <div className="success-content">
        <div className="success-card">
          {/* 成功アイコン */}
          <div className="success-icon-large">
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="55" fill="#4caf50" opacity="0.15"/>
              <circle cx="60" cy="60" r="45" fill="#4caf50" opacity="0.3"/>
              <circle cx="60" cy="60" r="35" fill="#4caf50"/>
              <path
                d="M 40 60 L 55 75 L 80 45"
                stroke="#fff"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="success-title">登録完了！</h1>
          <p className="success-subtitle">ありがとうございます</p>

          {/* メールアドレス表示 */}
          {email && (
            <div className="email-display">
              <div className="email-icon">📧</div>
              <div className="email-text">{email}</div>
            </div>
          )}

          {/* 説明 */}
          <div className="instructions">
            <h2 className="instructions-title">次のステップ</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>メールを確認</h3>
                  <p>登録したメールアドレスに確認メールを送信しました</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>リンクをクリック</h3>
                  <p>メール内の確認リンクをクリックしてください</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>ログイン</h3>
                  <p>メール確認後、ログインして学習を始めましょう！</p>
                </div>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="notice-box">
            <div className="notice-icon">💡</div>
            <div className="notice-content">
              <p className="notice-title">メールが届かない場合</p>
              <ul className="notice-list">
                <li>迷惑メールフォルダを確認してください</li>
                <li>メールアドレスが正しいか確認してください</li>
                <li>数分待ってから再送信してください</li>
              </ul>
            </div>
          </div>

          {/* 再送信メッセージ */}
          {resendMessage && (
            <div className={`resend-message ${resendMessage.includes('✓') ? 'success' : 'error'}`}>
              {resendMessage}
            </div>
          )}

          {/* ボタン */}
          <div className="button-group">
            <button
              onClick={handleResendEmail}
              className="success-button secondary"
              disabled={resending}
            >
              {resending ? '送信中...' : '確認メールを再送信'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="success-button primary"
            >
              ログイン画面へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          メール確認
        </h1>

        {status === 'verifying' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">確認中...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <p className="text-lg text-gray-700">{message}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              ログインする
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <p className="text-lg text-gray-700 mb-4">{message}</p>
            </div>
            <button
              onClick={handleResendEmail}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 mb-3"
            >
              確認メールを再送信
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              ログイン画面に戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

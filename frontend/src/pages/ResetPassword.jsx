import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で設定してください。');
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setError('トークンが見つかりません。');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword,
      });
      alert(response.data.message || 'パスワードを変更しました。');
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'パスワードのリセットに失敗しました。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">
          パスワードリセット
        </h1>
        <p className="text-center text-gray-600 mb-6">
          新しいパスワードを入力してください
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">新しいパスワード</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="8文字以上"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">パスワード確認</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="もう一度入力"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'リセット中...' : 'パスワードを変更'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

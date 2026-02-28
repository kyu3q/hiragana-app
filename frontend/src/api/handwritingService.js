import apiClient from './client';

// 手書き保存
export const saveHandwriting = async (userId, characterId, position, strokes) => {
  try {
    const response = await apiClient.post('/api/handwriting', {
      userId,
      characterId,
      position,
      strokes
    });
    return response.data;
  } catch (error) {
    console.error('手書き保存エラー:', error);
    throw error;
  }
};

// 既存データチェック
export const checkHandwritingExists = async (userId, characterId) => {
  try {
    const response = await apiClient.get('/api/handwriting/check', {
      params: { userId, characterId }
    });
    return response.data;
  } catch (error) {
    console.error('既存チェックエラー:', error);
    throw error;
  }
};

// ユーザーの保存データ取得
export const getUserHandwritings = async (userId, grade = null) => {
  try {
    const params = { };
    if (grade !== null) {
      params.grade = grade;
    }

    const response = await apiClient.get(`/api/handwriting/user/${userId}`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('手書き取得エラー:', error);
    throw error;
  }
};

// 手書き更新
export const updateHandwriting = async (id, userId, characterId, position, strokes) => {
  try {
    const response = await apiClient.put(`/api/handwriting/${id}`, {
      userId,
      characterId,
      position,
      strokes
    });
    return response.data;
  } catch (error) {
    console.error('手書き更新エラー:', error);
    throw error;
  }
};

// 手書き削除
export const deleteHandwriting = async (id) => {
  try {
    const response = await apiClient.delete(`/api/handwriting/${id}`);
    return response.data;
  } catch (error) {
    console.error('手書き削除エラー:', error);
    throw error;
  }
};

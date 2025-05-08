import apiClient from './client';

export const characterService = {
  // すべての文字を取得
  getAllCharacters: async () => {
    try {
      const response = await apiClient.get('/api/characters');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 文字種ごとに文字を取得
  getCharactersByType: async (type) => {
    try {
      const response = await apiClient.get(`/api/characters/type/${type}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 特定の文字を取得
  getCharacter: async (id) => {
    try {
      const response = await apiClient.get(`/api/characters/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 文字を保存
  saveCharacter: async (characterData) => {
    try {
      const response = await apiClient.post('/api/characters', characterData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // なぞり結果を保存
  saveStrokeResult: async (characterId, strokeData) => {
    try {
      const response = await apiClient.post(`/api/characters/${characterId}/strokes`, strokeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // なぞり結果を取得
  getStrokeResult: async (characterId) => {
    try {
      const response = await apiClient.get(`/api/characters/${characterId}/strokes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 
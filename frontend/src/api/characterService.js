import apiClient from './client';

export const characterService = {
    // 文字一覧を取得
    async getAllCharacters() {
        const response = await apiClient.get('/api/characters');
        return response.data;
    },

    // 特定のタイプの文字を取得
    getCharactersByType: async (type) => {
        const response = await apiClient.get(`/api/characters/type/${type}`);
        return response.data;
    },

    // 特定のタイプと難易度以下の文字を取得
    getCharactersByTypeAndDifficulty: async (type, maxDifficulty) => {
        const response = await apiClient.get(`/api/characters/type/${type}/difficulty/${maxDifficulty}`);
        return response.data;
    },

    // 特定の文字を取得
    getCharacterByTypeAndCharacter: async (type, character) => {
        const response = await apiClient.get(`/api/characters/type/${type}/character/${character}`);
        return response.data;
    },

    // なぞり結果を保存
    saveStrokeResult: async (characterId, strokeData) => {
        try {
            if (!characterId) {
                throw new Error('文字IDが設定されていません');
            }
            if (strokeData.position === undefined || strokeData.position === null) {
                throw new Error('位置情報が設定されていません');
            }

            console.log('Saving stroke result:', strokeData);
            const strokes = Array.isArray(strokeData.strokes) ? strokeData.strokes : [];
            
            const requestBody = {
                position: strokeData.position,
                strokes: strokes.map(stroke => ({
                    points: Array.isArray(stroke.points) ? stroke.points.map(point => ({
                        x: point.x,
                        y: point.y
                    })) : [],
                    score: stroke.score || 0,
                    comment: stroke.comment || ''
                })),
                score: strokeData.score || 0,
                comment: strokeData.comment || ''
            };

            console.log('Request body:', requestBody);
            
            const response = await apiClient.post(`/api/characters/${characterId}/stroke-result`, requestBody);
            return response.data;
        } catch (error) {
            console.error('Error saving stroke result:', error);
            throw error.response?.data || error;
        }
    },

    // なぞり結果を取得
    async getStrokeResult(characterId) {
        try {
            const response = await apiClient.get(`/api/characters/${characterId}/stroke-result`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stroke result:', error);
            throw error.response?.data || error;
        }
    },

    // すべてのなぞり結果を取得
    getAllStrokeResults: async (characterId) => {
        try {
            const response = await apiClient.get(`/api/characters/${characterId}/stroke-results`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stroke results:', error);
            throw error;
        }
    }
}; 
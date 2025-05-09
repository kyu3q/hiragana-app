import { API_BASE_URL } from '../config';

export const characterService = {
    // 文字一覧を取得
    async getAllCharacters() {
        const response = await fetch(`${API_BASE_URL}/characters`);
        if (!response.ok) {
            throw new Error('文字一覧の取得に失敗しました');
        }
        return response.json();
    },

    // 特定のタイプの文字を取得
    getCharactersByType: async (type) => {
        const response = await fetch(`${API_BASE_URL}/characters/type/${type}`);
        return response.json();
    },

    // 特定のタイプと難易度以下の文字を取得
    getCharactersByTypeAndDifficulty: async (type, maxDifficulty) => {
        const response = await fetch(`${API_BASE_URL}/characters/type/${type}/difficulty/${maxDifficulty}`);
        return response.json();
    },

    // 特定の文字を取得
    getCharacterByTypeAndCharacter: async (type, character) => {
        const response = await fetch(`${API_BASE_URL}/characters/type/${type}/character/${character}`);
        return response.json();
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
            
            const response = await fetch(`${API_BASE_URL}/characters/${characterId}/stroke-result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Server response:', errorData);
                throw new Error(errorData.message || `ストローク結果の保存に失敗しました (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving stroke result:', error);
            throw error;
        }
    },

    // なぞり結果を取得
    async getStrokeResult(characterId) {
        try {
            const response = await fetch(`${API_BASE_URL}/characters/${characterId}/stroke-result`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching stroke result:', error);
            throw error;
        }
    }
}; 
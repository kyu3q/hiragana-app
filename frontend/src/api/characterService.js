const API_BASE_URL = 'http://localhost:8080/api';

export const characterService = {
    // 文字一覧を取得
    getAllCharacters: async () => {
        const response = await fetch(`${API_BASE_URL}/characters`);
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
    saveStrokeResult: async (characterId, data) => {
        const response = await fetch(`${API_BASE_URL}/characters/${characterId}/stroke-result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // なぞり結果を取得
    getStrokeResult: async (characterId) => {
        const response = await fetch(`${API_BASE_URL}/characters/${characterId}/stroke-result`);
        return response.json();
    }
}; 
import apiClient from './client';

export const progressService = {
    // ユーザーの進捗を取得
    async getUserProgress(userId) {
        const response = await apiClient.get(`/api/progress/user/${userId}`);
        return response.data;
    },

    // 特定のタイプの文字の進捗を取得
    async getUserProgressByType(userId, type) {
        const response = await apiClient.get(`/api/progress/user/${userId}/type/${type}`);
        return response.data;
    },

    // 進捗を更新
    async updateProgress(userId, characterId, score) {
        const response = await apiClient.post(`/api/progress/user/${userId}/character/${characterId}`, null, {
            params: { score }
        });
        return response.data;
    },

    // コンプリート状態を保存
    async markAsCompleted(userId, characterId) {
        const response = await apiClient.post(`/api/progress/user/${userId}/character/${characterId}/complete`);
        return response.data;
    }
};

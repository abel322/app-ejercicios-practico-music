import api from './authService';
import type { Recommendation } from '../types/recommendation.types';

export const recommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const response = await api.get<{ recommendations: Recommendation[] }>('/api/recommendations');
      return response.data.recommendations;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar las recomendaciones');
    }
  },
};

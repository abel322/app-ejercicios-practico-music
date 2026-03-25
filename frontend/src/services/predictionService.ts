import api from './authService';
import type { PredictionResponse } from '../types/prediction.types';

export const predictionService = {
  async getNextLevelPrediction(instrument?: string): Promise<PredictionResponse> {
    try {
      const params = instrument ? { instrument } : {};
      const response = await api.get<PredictionResponse>('/api/predictions/next-level', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar las predicciones');
    }
  },
};

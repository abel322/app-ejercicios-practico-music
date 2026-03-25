import api from './authService';
import type { CurrentLevelResponse, LevelHistoryResponse } from '../types/level.types';

export const levelService = {
  /**
   * Obtiene el nivel actual del usuario y su progreso hacia el siguiente nivel
   */
  async getCurrentLevel(instrument?: string): Promise<CurrentLevelResponse> {
    try {
      const params = instrument ? { instrument } : {};
      const response = await api.get<CurrentLevelResponse>('/api/levels/current', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar el nivel actual');
    }
  },

  /**
   * Obtiene el historial de cambios de nivel del usuario
   */
  async getLevelHistory(instrument?: string): Promise<LevelHistoryResponse> {
    try {
      const params = instrument ? { instrument } : {};
      const response = await api.get<LevelHistoryResponse>('/api/levels/history', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar el historial de niveles');
    }
  },
};

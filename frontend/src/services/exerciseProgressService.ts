import api from './authService';
import type {
  ExerciseProgress,
  ExerciseProgressStats,
  UpdateProgressData,
  ExerciseStatus,
} from '../types/exercise-progress.types';

export const exerciseProgressService = {
  /**
   * Get progress for a specific exercise
   */
  async getProgress(exerciseId: string): Promise<ExerciseProgress | null> {
    try {
      const response = await api.get<ExerciseProgress>(`/api/exercise-progress/${exerciseId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.message || 'Error al obtener el progreso del ejercicio');
    }
  },

  /**
   * Get all exercise progress
   */
  async getAllProgress(status?: ExerciseStatus): Promise<ExerciseProgress[]> {
    try {
      const params = status ? { status } : {};
      const response = await api.get<ExerciseProgress[]>('/api/exercise-progress', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener el progreso de ejercicios');
    }
  },

  /**
   * Update exercise progress
   */
  async updateProgress(
    exerciseId: string,
    data: UpdateProgressData
  ): Promise<ExerciseProgress> {
    try {
      const response = await api.post<ExerciseProgress>(
        `/api/exercise-progress/${exerciseId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar el progreso');
    }
  },

  /**
   * Get progress statistics
   */
  async getStatistics(): Promise<ExerciseProgressStats> {
    try {
      const response = await api.get<ExerciseProgressStats>('/api/exercise-progress/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener estadísticas');
    }
  },

  /**
   * Reset exercise progress
   */
  async resetProgress(exerciseId: string): Promise<void> {
    try {
      await api.delete(`/api/exercise-progress/${exerciseId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Error al reiniciar el progreso');
    }
  },
};

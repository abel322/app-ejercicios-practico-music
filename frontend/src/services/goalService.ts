import api from './authService';
import type { Goal, GoalFormData, GoalUpdateData, GoalWithProgress } from '../types/goal.types';

export const goalService = {
  async getGoals(active?: boolean, instrument?: string): Promise<Goal[]> {
    try {
      const params = new URLSearchParams();
      if (active !== undefined) params.append('active', active.toString());
      if (instrument) params.append('instrument', instrument);
      
      const response = await api.get<{ goals: Goal[] }>(
        `/api/goals${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data.goals;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar las metas');
    }
  },

  async getGoal(id: string): Promise<GoalWithProgress> {
    try {
      const response = await api.get<{ 
        goal: Goal; 
        progress: { currentMinutes: number; percentage: number; completed: boolean } 
      }>(`/api/goals/${id}`);
      return {
        ...response.data.goal,
        progress: response.data.progress.percentage,
        currentMinutes: response.data.progress.currentMinutes,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar la meta');
    }
  },

  async createGoal(data: GoalFormData): Promise<Goal> {
    try {
      const response = await api.post<{ goal: Goal }>(`/api/goals`, data);
      return response.data.goal;
    } catch (error: any) {
      throw new Error(error.message || 'Error al crear la meta');
    }
  },

  async updateGoal(id: string, data: GoalUpdateData): Promise<Goal> {
    try {
      const response = await api.put<{ goal: Goal }>(`/api/goals/${id}`, data);
      return response.data.goal;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar la meta');
    }
  },

  async deleteGoal(id: string): Promise<void> {
    try {
      await api.delete(`/api/goals/${id}`);
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar la meta');
    }
  },
};

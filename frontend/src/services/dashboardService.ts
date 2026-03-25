import api from './authService';
import type {
  DashboardStats,
  PracticeChartResponse,
  InstrumentDistributionResponse,
  TopExercisesResponse,
  DateRangeFilter,
} from '../types/dashboard.types';

export const dashboardService = {
  /**
   * Get dashboard statistics
   * @param filters Optional date range filters and instrument
   * @returns Dashboard statistics
   */
  async getStats(filters?: DateRangeFilter & { instrument?: string }): Promise<DashboardStats> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters?.instrument) {
        params.append('instrument', filters.instrument);
      }

      const response = await api.get<DashboardStats>(
        `/api/dashboard/stats${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar las estadísticas');
    }
  },

  /**
   * Get practice chart data
   * @param filters Optional date range filters and instrument
   * @returns Practice chart data for the last 30 days
   */
  async getPracticeChart(filters?: DateRangeFilter & { instrument?: string }): Promise<PracticeChartResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters?.instrument) {
        params.append('instrument', filters.instrument);
      }

      const response = await api.get<PracticeChartResponse>(
        `/api/dashboard/practice-chart${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar los datos del gráfico');
    }
  },

  /**
   * Get instrument distribution data
   * @param filters Optional date range filters
   * @returns Instrument distribution data
   */
  async getInstrumentDistribution(
    filters?: DateRangeFilter
  ): Promise<InstrumentDistributionResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await api.get<InstrumentDistributionResponse>(
        `/api/dashboard/instrument-distribution${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar la distribución de instrumentos');
    }
  },

  /**
   * Get top exercises
   * @param filters Optional date range filters and instrument
   * @returns Top 5 exercises with total minutes
   */
  async getTopExercises(filters?: DateRangeFilter & { instrument?: string }): Promise<TopExercisesResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters?.instrument) {
        params.append('instrument', filters.instrument);
      }

      const response = await api.get<TopExercisesResponse>(
        `/api/dashboard/top-exercises${params.toString() ? `?${params.toString()}` : ''}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar los ejercicios más practicados');
    }
  },
};

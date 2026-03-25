import api from './authService';
import type { Exercise, ExerciseFormData, ExerciseUpdateData, Difficulty } from '../types/exercise.types';
import { saveItems, getAllItems, getItem, saveItem, deleteItem, STORES } from '../utils/indexedDB';

export const exerciseService = {
  async getExercises(
    search?: string,
    bookId?: string,
    difficulty?: Difficulty
  ): Promise<Exercise[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (bookId) params.append('bookId', bookId);
      if (difficulty) params.append('difficulty', difficulty);
      
      const response = await api.get<{ exercises: Exercise[] }>(
        `/api/exercises${params.toString() ? `?${params.toString()}` : ''}`
      );
      
      // Guardar en IndexedDB para acceso offline
      await saveItems(STORES.EXERCISES, response.data.exercises);
      
      return response.data.exercises;
    } catch (error: any) {
      // Si falla la petición, intentar obtener desde IndexedDB
      console.warn('Error al cargar ejercicios desde API, intentando desde caché:', error);
      const cachedExercises = await getAllItems<Exercise>(STORES.EXERCISES);
      
      if (cachedExercises.length > 0) {
        console.log('💪 Ejercicios obtenidos desde caché offline');
        
        // Aplicar filtros localmente
        let filteredExercises = cachedExercises;
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredExercises = filteredExercises.filter(exercise => 
            exercise.name.toLowerCase().includes(searchLower) ||
            exercise.description?.toLowerCase().includes(searchLower) ||
            exercise.notes?.toLowerCase().includes(searchLower)
          );
        }
        
        if (bookId) {
          filteredExercises = filteredExercises.filter(exercise => exercise.bookId === bookId);
        }
        
        if (difficulty) {
          filteredExercises = filteredExercises.filter(exercise => exercise.difficulty === difficulty);
        }
        
        return filteredExercises;
      }
      
      throw new Error(error.message || 'Error al cargar los ejercicios');
    }
  },

  async getExercise(id: string): Promise<Exercise> {
    try {
      const response = await api.get<{ exercise: Exercise }>(`/api/exercises/${id}`);
      
      // Guardar en IndexedDB
      await saveItem(STORES.EXERCISES, response.data.exercise);
      
      return response.data.exercise;
    } catch (error: any) {
      // Intentar obtener desde IndexedDB
      console.warn('Error al cargar ejercicio desde API, intentando desde caché:', error);
      const cachedExercise = await getItem<Exercise>(STORES.EXERCISES, id);
      
      if (cachedExercise) {
        console.log('💪 Ejercicio obtenido desde caché offline');
        return cachedExercise;
      }
      
      throw new Error(error.message || 'Error al cargar el ejercicio');
    }
  },

  async createExercise(data: ExerciseFormData): Promise<Exercise> {
    try {
      console.log('📝 Creando ejercicio con datos:', data);
      
      const response = await api.post<{ exercise: Exercise }>(
        `/api/exercises`,
        data
      );
      
      console.log('✅ Ejercicio creado exitosamente:', response.data.exercise);
      
      // Guardar en IndexedDB
      await saveItem(STORES.EXERCISES, response.data.exercise);
      
      return response.data.exercise;
    } catch (error: any) {
      console.error('❌ Error al crear ejercicio:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.message || 'Error al crear el ejercicio');
    }
  },

  async updateExercise(id: string, data: ExerciseUpdateData): Promise<Exercise> {
    try {
      const response = await api.put<{ exercise: Exercise }>(
        `/api/exercises/${id}`,
        data
      );
      
      // Actualizar en IndexedDB
      await saveItem(STORES.EXERCISES, response.data.exercise);
      
      return response.data.exercise;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar el ejercicio');
    }
  },

  async deleteExercise(id: string): Promise<void> {
    try {
      await api.delete(`/api/exercises/${id}`);
      
      // Eliminar de IndexedDB
      await deleteItem(STORES.EXERCISES, id);
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar el ejercicio');
    }
  },
};

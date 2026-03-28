import api from './authService';
import type { Session, SessionFormData, SessionUpdateData, SessionResponse } from '../types/session.types';
import { saveItems, getAllItems, getItem, saveItem, deleteItem, STORES } from '../utils/indexedDB';
import { enqueueOperation } from '../utils/offlineQueue';

export const sessionService = {
  async getSessions(
    startDate?: string,
    endDate?: string,
    limit?: number,
    offset?: number
  ): Promise<{ sessions: Session[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const response = await api.get<{ sessions: Session[]; total: number }>(
        `/api/sessions${params.toString() ? `?${params.toString()}` : ''}`
      );
      
      // Guardar en IndexedDB para acceso offline
      await saveItems(STORES.SESSIONS, response.data.sessions);
      
      return response.data;
    } catch (error: any) {
      // Si falla la petición, intentar obtener desde IndexedDB
      console.warn('Error al cargar sesiones desde API, intentando desde caché:', error);
      const cachedSessions = await getAllItems<Session>(STORES.SESSIONS);
      
      if (cachedSessions.length > 0) {
        console.log('📝 Sesiones obtenidas desde caché offline');
        
        // Aplicar filtros localmente
        let filteredSessions = cachedSessions;
        
        if (startDate) {
          filteredSessions = filteredSessions.filter(session => 
            new Date(session.date) >= new Date(startDate)
          );
        }
        
        if (endDate) {
          filteredSessions = filteredSessions.filter(session => 
            new Date(session.date) <= new Date(endDate)
          );
        }
        
        // Ordenar por fecha descendente
        filteredSessions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Aplicar paginación
        const start = offset || 0;
        const end = limit ? start + limit : filteredSessions.length;
        const paginatedSessions = filteredSessions.slice(start, end);
        
        return {
          sessions: paginatedSessions,
          total: filteredSessions.length
        };
      }
      
      throw new Error(error.message || 'Error al cargar las sesiones');
    }
  },

  async getSession(id: string): Promise<Session> {
    try {
      const response = await api.get<{ session: Session }>(`/api/sessions/${id}`);
      
      // Guardar en IndexedDB
      await saveItem(STORES.SESSIONS, response.data.session);
      
      return response.data.session;
    } catch (error: any) {
      // Intentar obtener desde IndexedDB
      console.warn('Error al cargar sesión desde API, intentando desde caché:', error);
      const cachedSession = await getItem<Session>(STORES.SESSIONS, id);
      
      if (cachedSession) {
        console.log('📝 Sesión obtenida desde caché offline');
        return cachedSession;
      }
      
      throw new Error(error.message || 'Error al cargar la sesión');
    }
  },

  async createSession(data: SessionFormData): Promise<SessionResponse> {
    try {
      const response = await api.post<SessionResponse>(
        `/api/sessions`,
        data
      );
      
      // Guardar en IndexedDB
      await saveItem(STORES.SESSIONS, response.data.session);
      
      return response.data;
    } catch (error: any) {
      // Si está offline, encolar la operación
      if (!navigator.onLine) {
        console.log('📥 Sesión encolada para sincronización offline');
        enqueueOperation('POST', '/api/sessions', data);
        
        // Crear una sesión temporal para mostrar en la UI
        const tempSession: Session = {
          id: `temp-${Date.now()}`,
          userId: 'temp',
          date: data.date,
          durationMinutes: data.durationMinutes,
          notes: data.notes || '',
          exercises: data.exercises.map((e, index) => ({
            id: `temp-ex-${Date.now()}-${index}`,
            sessionId: `temp-${Date.now()}`,
            exerciseId: e.exerciseId,
            durationMinutes: e.durationMinutes
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Guardar temporalmente en IndexedDB
        await saveItem(STORES.SESSIONS, tempSession);
        
        return {
          session: tempSession,
          levelChanged: false,
        };
      }
      
      throw new Error(error.message || 'Error al crear la sesión');
    }
  },

  async updateSession(id: string, data: SessionUpdateData): Promise<Session> {
    try {
      const response = await api.put<{ session: Session }>(
        `/api/sessions/${id}`,
        data
      );
      
      // Actualizar en IndexedDB
      await saveItem(STORES.SESSIONS, response.data.session);
      
      return response.data.session;
    } catch (error: any) {
      // Si está offline, encolar la operación
      if (!navigator.onLine) {
        console.log('📥 Actualización de sesión encolada para sincronización offline');
        enqueueOperation('PUT', `/api/sessions/${id}`, data);
        
        // Actualizar localmente en IndexedDB
        const cachedSession = await getItem<Session>(STORES.SESSIONS, id);
        if (cachedSession) {
          const updatedSession: Session = { 
            ...cachedSession, 
            ...data, 
            notes: data.notes !== undefined ? data.notes : cachedSession.notes,
            exercises: data.exercises ? data.exercises.map((e, index) => ({
              id: `temp-ex-${Date.now()}-${index}`,
              sessionId: cachedSession.id,
              exerciseId: e.exerciseId,
              durationMinutes: e.durationMinutes
            })) : cachedSession.exercises,
            updatedAt: new Date().toISOString() 
          };
          await saveItem(STORES.SESSIONS, updatedSession);
          return updatedSession;
        }
      }
      
      throw new Error(error.message || 'Error al actualizar la sesión');
    }
  },

  async deleteSession(id: string): Promise<void> {
    try {
      await api.delete(`/api/sessions/${id}`);
      
      // Eliminar de IndexedDB
      await deleteItem(STORES.SESSIONS, id);
    } catch (error: any) {
      // Si está offline, encolar la operación
      if (!navigator.onLine) {
        console.log('📥 Eliminación de sesión encolada para sincronización offline');
        enqueueOperation('DELETE', `/api/sessions/${id}`);
        
        // Eliminar localmente de IndexedDB
        await deleteItem(STORES.SESSIONS, id);
        return;
      }
      
      throw new Error(error.message || 'Error al eliminar la sesión');
    }
  },
};

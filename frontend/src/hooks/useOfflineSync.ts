import { useEffect, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { processQueue, hasQueuedOperations } from '../utils/offlineQueue';
import axios from 'axios';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para sincronizar automáticamente las operaciones en cola cuando se recupera la conexión
 */
export const useOfflineSync = () => {
  const isOnline = useOnlineStatus();
  const { showNotification } = useNotification();

  const syncQueue = useCallback(async () => {
    if (!hasQueuedOperations()) {
      return;
    }

    try {
      const result = await processQueue(axios);
      
      if (result.success > 0) {
        showNotification(
          `${result.success} operación(es) sincronizada(s) exitosamente`,
          'success'
        );
      }
      
      if (result.failed > 0) {
        showNotification(
          `${result.failed} operación(es) no pudieron sincronizarse`,
          'warning'
        );
      }
    } catch (error) {
      console.error('Error al sincronizar cola:', error);
      showNotification(
        'Error al sincronizar operaciones pendientes',
        'error'
      );
    }
  }, [showNotification]);

  useEffect(() => {
    // Cuando se recupera la conexión, sincronizar la cola
    if (isOnline) {
      const timer = setTimeout(() => {
        syncQueue();
      }, 1000); // Esperar 1 segundo después de recuperar la conexión

      return () => clearTimeout(timer);
    }
  }, [isOnline, syncQueue]);

  return { syncQueue };
};

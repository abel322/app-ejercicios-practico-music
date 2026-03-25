import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar el estado de conexión online/offline
 * @returns {boolean} true si está online, false si está offline
 */
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🟢 Conexión restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('🔴 Conexión perdida');
    };

    // Agregar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

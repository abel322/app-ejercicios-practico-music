import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration: number = 5000) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const notification: Notification = {
        id,
        message,
        type,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-ocultar después de la duración especificada
      if (duration > 0) {
        setTimeout(() => {
          hideNotification(id);
        }, duration);
      }
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      showNotification,
      hideNotification,
    }),
    [notifications, showNotification, hideNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

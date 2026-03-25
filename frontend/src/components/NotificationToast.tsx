import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

export const NotificationToast: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  // Mostrar solo la primera notificación (las demás se encolarán)
  const currentNotification = notifications[0];

  if (!currentNotification) {
    return null;
  }

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    // No cerrar si el usuario hace clic fuera del snackbar
    if (reason === 'clickaway') {
      return;
    }
    hideNotification(currentNotification.id);
  };

  // Mapear tipo de notificación a severity de Alert
  const severity: AlertColor = currentNotification.type;

  return (
    <Snackbar
      open={true}
      autoHideDuration={currentNotification.duration || 5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        role="alert"
        aria-live="assertive"
      >
        {currentNotification.message}
      </Alert>
    </Snackbar>
  );
};

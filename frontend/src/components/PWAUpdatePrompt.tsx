import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Componente que muestra un diálogo cuando hay una actualización disponible de la PWA
 */
export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('✅ Service Worker registrado:', registration);
    },
    onRegisterError(error) {
      console.error('❌ Error al registrar Service Worker:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  useEffect(() => {
    if (offlineReady) {
      console.log('✅ La aplicación está lista para funcionar offline');
    }
  }, [offlineReady]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  const handleOfflineClose = () => {
    setOfflineReady(false);
  };

  return (
    <>
      {/* Diálogo de actualización disponible */}
      <Dialog
        open={showPrompt}
        onClose={handleClose}
        aria-labelledby="update-dialog-title"
        aria-describedby="update-dialog-description"
      >
        <DialogTitle id="update-dialog-title">
          Nueva versión disponible
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="update-dialog-description">
            Hay una nueva versión de la aplicación disponible. 
            ¿Deseas actualizar ahora para obtener las últimas mejoras y correcciones?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Más tarde
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary" autoFocus>
            Actualizar ahora
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de modo offline listo */}
      <Dialog
        open={offlineReady}
        onClose={handleOfflineClose}
        aria-labelledby="offline-dialog-title"
      >
        <DialogTitle id="offline-dialog-title">
          ✓ Modo offline activado
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            La aplicación está lista para funcionar sin conexión a Internet.
            Podrás acceder a tus datos guardados incluso cuando estés offline.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOfflineClose} variant="contained" color="primary">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

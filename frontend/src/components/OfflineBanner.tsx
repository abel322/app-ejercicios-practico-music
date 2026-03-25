import { 
  Alert, 
  Slide, 
  Snackbar, 
  Box, 
  Typography, 
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useState, useEffect } from 'react';

/**
 * Banner que se muestra cuando la aplicación está offline
 * Muestra información detallada sobre funcionalidades disponibles y limitadas
 */
export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      // Mostrar banner offline
      setShowOffline(true);
      setShowOnline(false);
    } else {
      // Ocultar banner offline y mostrar mensaje de reconexión brevemente
      setShowOffline(false);
      setExpanded(false);
      if (showOffline) {
        // Solo mostrar mensaje de reconexión si estábamos offline antes
        setShowOnline(true);
        setTimeout(() => {
          setShowOnline(false);
        }, 3000);
      }
    }
  }, [isOnline, showOffline]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Banner persistente cuando está offline */}
      <Snackbar
        open={showOffline}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{ top: { xs: 56, sm: 64 } }} // Debajo del header
      >
        <Alert 
          severity="warning" 
          variant="filled"
          sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', sm: 600 },
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Box sx={{ width: '100%' }}>
            {/* Mensaje principal */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={handleExpandClick}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>📡</span>
                <Typography variant="body2" fontWeight="medium">
                  Modo Offline - Funciones limitadas
                </Typography>
              </Box>
              <IconButton
                size="small"
                sx={{ 
                  color: 'inherit',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
                aria-label="mostrar más"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>

            {/* Detalles expandibles */}
            <Collapse in={expanded} timeout="auto">
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'medium' }}>
                  ✓ Funciones disponibles:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: 'success.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Ver libros y ejercicios guardados</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: 'success.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Visualizar PDFs previamente cargados</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: 'success.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Ver sesiones de práctica anteriores</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: 'success.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Registrar sesiones (se sincronizarán al reconectar)</Typography>}
                    />
                  </ListItem>
                </List>

                <Typography variant="caption" sx={{ display: 'block', mt: 2, mb: 1, fontWeight: 'medium' }}>
                  ✗ Funciones no disponibles:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CancelIcon fontSize="small" sx={{ color: 'error.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Subir nuevos libros PDF</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CancelIcon fontSize="small" sx={{ color: 'error.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Actualizar estadísticas en tiempo real</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CancelIcon fontSize="small" sx={{ color: 'error.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Recibir recomendaciones actualizadas</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CancelIcon fontSize="small" sx={{ color: 'error.light' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="caption">Exportar datos</Typography>}
                    />
                  </ListItem>
                </List>

                <Typography variant="caption" sx={{ display: 'block', mt: 2, fontStyle: 'italic', opacity: 0.9 }}>
                  Los cambios realizados offline se sincronizarán automáticamente al restaurar la conexión.
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </Alert>
      </Snackbar>

      {/* Banner temporal cuando se recupera la conexión */}
      <Snackbar
        open={showOnline}
        autoHideDuration={3000}
        onClose={() => setShowOnline(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{ top: { xs: 56, sm: 64 } }}
      >
        <Alert 
          severity="success" 
          variant="filled"
          onClose={() => setShowOnline(false)}
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          <span>✓</span>
          <span>Conexión restaurada - Sincronizando datos...</span>
        </Alert>
      </Snackbar>
    </>
  );
};

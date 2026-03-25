import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

/**
 * Componente LoadingSpinner para mostrar durante operaciones asíncronas
 * Puede usarse en modo fullScreen o inline
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  size = 40,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <Box
        role="status"
        aria-live="polite"
        aria-label={message}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={size} aria-label="Cargando" />
        {message && (
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: 'white',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label={message}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <CircularProgress size={size} aria-label="Cargando" />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;

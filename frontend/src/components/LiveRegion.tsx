import React from 'react';
import { Box } from '@mui/material';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
}

/**
 * Componente LiveRegion para anuncios a lectores de pantalla
 * Usa aria-live para notificar cambios dinámicos de contenido
 */
const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  politeness = 'polite',
}) => {
  return (
    <Box
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      sx={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {message}
    </Box>
  );
};

export default LiveRegion;

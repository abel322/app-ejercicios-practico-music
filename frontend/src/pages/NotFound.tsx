import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" color="primary">
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          La página que buscas no existe o ha sido movida.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;

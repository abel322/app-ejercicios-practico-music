import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (): boolean => {
    if (!email) {
      setError('El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al enviar el email';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Recuperar Contraseña
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Ingresa tu email y te enviaremos instrucciones
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Se ha enviado un email con instrucciones para recuperar tu contraseña
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={!!error}
              helperText={error}
              margin="normal"
              autoComplete="email"
              autoFocus
              disabled={success}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || success}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Enviar Instrucciones'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Volver a iniciar sesión
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;

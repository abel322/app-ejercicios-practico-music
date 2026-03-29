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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Instrument } from '../types/auth.types';
import type { RegisterFormData } from '../types/auth.types';

const INSTRUMENTS = [
  { value: Instrument.PIANO, label: 'Piano' },
  { value: Instrument.BASS, label: 'Bajo' },
  { value: Instrument.DRUMS, label: 'Batería' },
  { value: Instrument.GUITAR, label: 'Guitarra' },
];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instruments: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúscula, minúscula y número';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar instrumentos
    if (formData.instruments.length === 0) {
      newErrors.instruments = 'Selecciona al menos un instrumento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleInstrumentsChange = (event: SelectChangeEvent<Instrument[]>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      instruments: typeof value === 'string' ? [value as Instrument] : value,
    }));
    if (errors.instruments) {
      setErrors((prev) => ({ ...prev, instruments: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      showNotification('Registro y login exitoso', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Error al registrarse';
      setApiError(message);
      showNotification(message, 'error');
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
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Crear Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Regístrate en Music Practice
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} aria-label="Formulario de registro">
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              autoComplete="name"
              autoFocus
              required
              aria-required="true"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              autoComplete="email"
              required
              aria-required="true"
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || 'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número'}
              margin="normal"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-describedby="password-requirements"
            />

            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              autoComplete="new-password"
              required
              aria-required="true"
            />

            <FormControl fullWidth margin="normal" error={!!errors.instruments} required>
              <InputLabel id="instruments-label">Instrumentos</InputLabel>
              <Select
                labelId="instruments-label"
                multiple
                value={formData.instruments}
                onChange={handleInstrumentsChange}
                input={<OutlinedInput label="Instrumentos" />}
                renderValue={(selected: Instrument[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: Instrument) => (
                      <Chip
                        key={value}
                        label={INSTRUMENTS.find((i) => i.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
                aria-required="true"
                aria-describedby="instruments-error"
              >
                {INSTRUMENTS.map((instrument) => (
                  <MenuItem key={instrument.value} value={instrument.value}>
                    {instrument.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.instruments && (
                <Typography 
                  id="instruments-error"
                  variant="caption" 
                  color="error" 
                  sx={{ mt: 0.5, ml: 2 }}
                  role="alert"
                >
                  {errors.instruments}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
              aria-label={isLoading ? 'Registrando...' : 'Registrarse'}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => navigate('/login')}
                type="button"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

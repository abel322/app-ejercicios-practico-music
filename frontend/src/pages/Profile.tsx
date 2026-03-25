import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Instrument } from '../types/auth.types';
import api from '../services/authService';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useNotification();

  // Estado para edición de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    instruments: user?.instruments || [],
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Instrumentos disponibles
  const availableInstruments = [
    { value: Instrument.GUITAR, label: 'Guitarra' },
    { value: Instrument.PIANO, label: 'Piano' },
    { value: Instrument.BASS, label: 'Bajo' },
    { value: Instrument.DRUMS, label: 'Batería' },
  ];

  // Mapeo de niveles a español
  const levelLabels: Record<string, string> = {
    BASIC: 'Básico',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Manejar cambio de instrumentos
  const handleInstrumentChange = (event: SelectChangeEvent<Instrument[]>) => {
    const value = event.target.value;
    setProfileData({
      ...profileData,
      instruments: typeof value === 'string' ? [value as Instrument] : value,
    });
  };

  // Validar y actualizar perfil
  const handleUpdateProfile = async () => {
    // Validación
    if (!profileData.name.trim()) {
      showNotification('El nombre no puede estar vacío', 'error');
      return;
    }

    if (profileData.instruments.length === 0) {
      showNotification('Debes seleccionar al menos un instrumento', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await api.put('/api/users/profile', {
        name: profileData.name,
        instruments: profileData.instruments,
      });

      updateProfile(response.data.user);
      showNotification('Perfil actualizado correctamente', 'success');
      setIsEditingProfile(false);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al actualizar el perfil';
      showNotification(message, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Cancelar edición de perfil
  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || '',
      instruments: user?.instruments || [],
    });
    setIsEditingProfile(false);
  };

  // Validar contraseña
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return errors;
  };

  // Manejar cambio de contraseña
  const handleChangePassword = async () => {
    // Validación
    const errors: string[] = [];

    if (!passwordData.currentPassword) {
      errors.push('Debes ingresar tu contraseña actual');
    }

    if (!passwordData.newPassword) {
      errors.push('Debes ingresar una nueva contraseña');
    }

    if (!passwordData.confirmNewPassword) {
      errors.push('Debes confirmar la nueva contraseña');
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.push('Las contraseñas nuevas no coinciden');
    }

    // Validar requisitos de la nueva contraseña
    if (passwordData.newPassword) {
      const passwordValidationErrors = validatePassword(passwordData.newPassword);
      errors.push(...passwordValidationErrors);
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    setPasswordErrors([]);

    try {
      await api.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showNotification('Contraseña cambiada correctamente', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cambiar la contraseña';
      showNotification(message, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Gestiona tu información personal y configuración de cuenta.
        </Typography>

        <Grid container spacing={3}>
          {/* Información del usuario */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {!isEditingProfile ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Instrumentos
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {user.instruments.map((instrument) => (
                        <Chip
                          key={instrument}
                          label={
                            availableInstruments.find((i) => i.value === instrument)?.label ||
                            instrument
                          }
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nivel
                    </Typography>
                    <Typography variant="body1">
                      {levelLabels[user.currentLevel] || user.currentLevel}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Miembro desde
                    </Typography>
                    <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setIsEditingProfile(true)}
                    fullWidth
                  >
                    Editar Perfil
                  </Button>
                </>
              ) : (
                <>
                  <TextField
                    label="Nombre"
                    value={profileData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, name: e.target.value })}
                    fullWidth
                    margin="normal"
                    required
                  />

                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Instrumentos</InputLabel>
                    <Select
                      multiple
                      value={profileData.instruments}
                      onChange={handleInstrumentChange}
                      input={<OutlinedInput label="Instrumentos" />}
                      renderValue={(selected: Instrument[]) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value: Instrument) => (
                            <Chip
                              key={value}
                              label={
                                availableInstruments.find((i) => i.value === value)?.label || value
                              }
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {availableInstruments.map((instrument) => (
                        <MenuItem key={instrument.value} value={instrument.value}>
                          {instrument.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleUpdateProfile}
                      disabled={profileLoading}
                      fullWidth
                    >
                      {profileLoading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={profileLoading}
                      fullWidth
                    >
                      Cancelar
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          {/* Cambio de contraseña */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cambiar Contraseña
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {passwordErrors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {passwordErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </Alert>
              )}

              <TextField
                label="Contraseña Actual"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Nueva Contraseña"
                type="password"
                value={passwordData.newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                fullWidth
                margin="normal"
                required
                helperText="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
              />

              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                }
                fullWidth
                margin="normal"
                required
              />

              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={passwordLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {passwordLoading ? <CircularProgress size={24} /> : 'Cambiar Contraseña'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;

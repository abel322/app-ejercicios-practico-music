import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Paper,
  Typography,
} from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import { goalService } from '../services/goalService';
import type { GoalFormData, GoalType } from '../types/goal.types';

interface GoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSuccess, onCancel }) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GoalFormData>({
    type: 'DAILY',
    targetMinutes: 30,
    startDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GoalFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GoalFormData, string>> = {};

    if (formData.targetMinutes <= 0) {
      newErrors.targetMinutes = 'La duración debe ser un número positivo';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await goalService.createGoal({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
      });
      showNotification('Meta creada exitosamente', 'success');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al crear la meta',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, type: event.target.value as GoalType });
  };

  const handleTargetMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setFormData({ ...formData, targetMinutes: isNaN(value) ? 0 : value });
    if (errors.targetMinutes) {
      setErrors({ ...errors, targetMinutes: undefined });
    }
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, startDate: event.target.value });
    if (errors.startDate) {
      setErrors({ ...errors, startDate: undefined });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Crear Nueva Meta
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} aria-label="Formulario de creación de meta">
        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend">Tipo de Meta</FormLabel>
          <RadioGroup
            row
            value={formData.type}
            onChange={handleTypeChange}
            aria-label="Tipo de meta"
          >
            <FormControlLabel value="DAILY" control={<Radio />} label="Diaria" />
            <FormControlLabel value="WEEKLY" control={<Radio />} label="Semanal" />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label="Objetivo (minutos)"
          type="number"
          value={formData.targetMinutes}
          onChange={handleTargetMinutesChange}
          error={!!errors.targetMinutes}
          helperText={errors.targetMinutes}
          sx={{ mb: 3 }}
          inputProps={{ 
            min: 1,
            'aria-label': 'Objetivo en minutos'
          }}
          required
          aria-required="true"
        />

        <TextField
          fullWidth
          label="Fecha de Inicio"
          type="date"
          value={formData.startDate}
          onChange={handleStartDateChange}
          error={!!errors.startDate}
          helperText={errors.startDate}
          sx={{ mb: 3 }}
          InputLabelProps={{
            shrink: true,
          }}
          required
          aria-required="true"
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            aria-label={loading ? 'Creando meta...' : 'Crear meta'}
          >
            {loading ? 'Creando...' : 'Crear Meta'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoalForm;

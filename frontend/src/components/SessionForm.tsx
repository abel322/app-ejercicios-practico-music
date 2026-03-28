import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  FormHelperText,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { SessionFormData } from '../types/session.types';
import type { Exercise } from '../types/exercise.types';
import { exerciseService } from '../services/exerciseService';

interface SessionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormData) => Promise<void>;
  initialData?: Partial<SessionFormData>;
  title?: string;
  instrument?: string;
}

interface ExerciseEntry {
  exerciseId: string;
  durationMinutes: number;
  exercise?: Exercise;
}

const SessionForm: React.FC<SessionFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Registrar Sesión',
}) => {
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    exercises?: string;
  }>({});

  // Cargar ejercicios disponibles
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercises = await exerciseService.getExercises();
        setAvailableExercises(exercises);
      } catch (error) {
        console.error('Error loading exercises:', error);
      }
    };

    if (open) {
      loadExercises();
    }
  }, [open]);

  // Inicializar formulario con datos iniciales
  useEffect(() => {
    if (open) {
      if (initialData?.date) {
        // Convertir ISO string a formato YYYY-MM-DD para el input
        const dateObj = new Date(initialData.date);
        const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
        setDate(localDate.toISOString().split('T')[0]);
      } else {
        // Fecha actual por defecto
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        setDate(localDate.toISOString().split('T')[0]);
      }

      setNotes(initialData?.notes || '');

      if (initialData?.exercises && initialData.exercises.length > 0) {
        setExerciseEntries(
          initialData.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            durationMinutes: ex.durationMinutes,
          }))
        );
      } else {
        setExerciseEntries([{ exerciseId: '', durationMinutes: 0 }]);
      }

      setErrors({});
    }
  }, [open, initialData]);

  const handleAddExercise = () => {
    setExerciseEntries([...exerciseEntries, { exerciseId: '', durationMinutes: 0 }]);
  };

  const handleRemoveExercise = (index: number) => {
    const newEntries = exerciseEntries.filter((_, i) => i !== index);
    setExerciseEntries(newEntries);
  };

  const handleExerciseChange = (index: number, exerciseId: string) => {
    const newEntries = [...exerciseEntries];
    newEntries[index].exerciseId = exerciseId;
    setExerciseEntries(newEntries);
  };

  const handleDurationChange = (index: number, duration: number) => {
    const newEntries = [...exerciseEntries];
    newEntries[index].durationMinutes = duration;
    setExerciseEntries(newEntries);
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // Validar fecha no futura
    const selectedDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      newErrors.date = 'La fecha no puede ser futura';
    }

    // Validar que haya al menos un ejercicio con duración positiva
    const validExercises = exerciseEntries.filter(
      (entry) => entry.exerciseId && entry.durationMinutes > 0
    );

    if (validExercises.length === 0) {
      newErrors.exercises = 'Debes agregar al menos un ejercicio con duración positiva';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Filtrar ejercicios válidos
      const validExercises = exerciseEntries.filter(
        (entry) => entry.exerciseId && entry.durationMinutes > 0
      );

      // Calcular duración total
      const totalDuration = validExercises.reduce(
        (sum, entry) => sum + entry.durationMinutes,
        0
      );

      // Convertir fecha a ISO string (inicio del día en UTC)
      const dateObj = new Date(date + 'T00:00:00');
      const isoDate = dateObj.toISOString();

      const formData: SessionFormData = {
        date: isoDate,
        durationMinutes: totalDuration,
        exercises: validExercises.map((entry) => ({
          exerciseId: entry.exerciseId,
          durationMinutes: entry.durationMinutes,
        })),
        notes: notes.trim() || undefined,
      };

      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDate('');
    setNotes('');
    setExerciseEntries([{ exerciseId: '', durationMinutes: 0 }]);
    setErrors({});
    onClose();
  };

  const getTotalDuration = () => {
    return exerciseEntries.reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="session-form-dialog-title"
    >
      <DialogTitle id="session-form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Fecha */}
          <TextField
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{
              shrink: true,
            }}
            aria-required="true"
          />

          {/* Ejercicios */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">Ejercicios</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddExercise}
                size="small"
                variant="outlined"
                aria-label="Agregar otro ejercicio"
              >
                Agregar Ejercicio
              </Button>
            </Box>

            {exerciseEntries.map((entry, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2,
                  alignItems: 'flex-start',
                }}
              >
                <Autocomplete
                  options={availableExercises}
                  getOptionLabel={(option) =>
                    `${option.name}${option.book ? ` - ${option.book.name}` : ''}`
                  }
                  value={
                    availableExercises.find((ex) => ex.id === entry.exerciseId) || null
                  }
                  onChange={(_, newValue) => {
                    handleExerciseChange(index, newValue?.id || '');
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Ejercicio" 
                      required
                      aria-label={`Ejercicio ${index + 1}`}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body1">{option.name}</Typography>
                        {option.book && (
                          <Typography variant="caption" color="text.secondary">
                            {option.book.name} - {option.book.instrument}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="Duración (min)"
                  type="number"
                  value={entry.durationMinutes || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleDurationChange(index, value);
                  }}
                  inputProps={{ 
                    min: 0,
                    'aria-label': `Duración en minutos del ejercicio ${index + 1}`
                  }}
                  required
                  sx={{ width: 150 }}
                />

                <IconButton
                  onClick={() => handleRemoveExercise(index)}
                  disabled={exerciseEntries.length === 1}
                  color="error"
                  sx={{ mt: 1 }}
                  aria-label={`Eliminar ejercicio ${index + 1}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {errors.exercises && (
              <FormHelperText error role="alert">{errors.exercises}</FormHelperText>
            )}
          </Box>

          {/* Duración total */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Duración total:
            </Typography>
            <Chip
              label={`${getTotalDuration()} minutos`}
              color="primary"
              variant="outlined"
              aria-label={`Duración total: ${getTotalDuration()} minutos`}
            />
          </Box>

          {/* Notas */}
          <TextField
            label="Notas (opcional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            placeholder="Agrega notas sobre tu sesión de práctica..."
            aria-label="Notas de la sesión"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          aria-label={loading ? 'Guardando sesión...' : 'Guardar sesión'}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionForm;

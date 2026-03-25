import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Autocomplete,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { exerciseService } from '../services/exerciseService';
import { sessionService } from '../services/sessionService';
import { useNotification } from '../contexts/NotificationContext';
import type { Exercise } from '../types/exercise.types';

interface SelectedExercise {
  exerciseId: string;
  name: string;
  durationMinutes: number;
}

const PracticeTimer: React.FC = () => {
  // Estado del temporizador
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Estado de ejercicios
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [exerciseToAdd, setExerciseToAdd] = useState<Exercise | null>(null);

  // Estado del formulario de guardado
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showNotification } = useNotification();

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await exerciseService.getExercises();
        setExercises(data);
      } catch (error) {
        showNotification('Error al cargar ejercicios', 'error');
      }
    };
    loadExercises();
  }, [showNotification]);

  // Formatear tiempo en HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // useEffect para el interval del temporizador
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused]);

  // useEffect para beforeunload cuando hay sesión activa
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning || elapsedSeconds > 0) {
        e.preventDefault();
        e.returnValue = '¿Deseas guardar la sesión de práctica antes de salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, elapsedSeconds]);

  // Funciones del temporizador
  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stopTimer = useCallback(() => {
    if (elapsedSeconds === 0) {
      showNotification('No hay tiempo registrado para guardar', 'warning');
      return;
    }
    setShowSaveDialog(true);
  }, [elapsedSeconds, showNotification]);

  // Funciones de ejercicios
  const addExercise = useCallback(() => {
    if (!exerciseToAdd) {
      showNotification('Selecciona un ejercicio', 'warning');
      return;
    }

    // Verificar si el ejercicio ya está agregado
    if (selectedExercises.some((ex) => ex.exerciseId === exerciseToAdd.id)) {
      showNotification('Este ejercicio ya está agregado', 'warning');
      return;
    }

    const newExercise: SelectedExercise = {
      exerciseId: exerciseToAdd.id,
      name: exerciseToAdd.name,
      durationMinutes: 0,
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
    setExerciseToAdd(null);
    showNotification('Ejercicio agregado', 'success', 2000);
  }, [exerciseToAdd, selectedExercises, showNotification]);

  const removeExercise = useCallback((exerciseId: string) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex.exerciseId !== exerciseId));
  }, []);

  const updateExerciseDuration = useCallback((exerciseId: string, duration: number) => {
    setSelectedExercises((prev) =>
      prev.map((ex) =>
        ex.exerciseId === exerciseId ? { ...ex, durationMinutes: duration } : ex
      )
    );
  }, []);

  // Función para guardar sesión
  const saveSession = useCallback(async () => {
    setIsSaving(true);
    try {
      const durationMinutes = Math.round(elapsedSeconds / 60);

      const sessionData = {
        date: new Date().toISOString(),
        durationMinutes,
        exercises: selectedExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          durationMinutes: ex.durationMinutes,
        })),
        notes: notes.trim(),
      };

      const response = await sessionService.createSession(sessionData);

      // Mostrar notificaciones según la respuesta
      showNotification('Sesión guardada exitosamente', 'success');

      if (response.levelChanged && response.newLevel) {
        const levelLabels: Record<string, string> = {
          BASIC: 'Básico',
          INTERMEDIATE: 'Intermedio',
          ADVANCED: 'Avanzado',
        };
        const levelLabel = levelLabels[response.newLevel] || response.newLevel;
        showNotification(
          `🎉 ¡Felicitaciones! Has alcanzado el nivel ${levelLabel}`,
          'success',
          7000
        );
        
        // Actualizar el nivel del usuario en el contexto de autenticación
        // (esto se hará automáticamente al recargar el perfil o la página)
      }

      // Notificar metas completadas
      if (response.goalsCompleted && response.goalsCompleted.length > 0) {
        response.goalsCompleted.forEach((goal) => {
          const goalTypeLabel = goal.type === 'DAILY' ? 'diaria' : 'semanal';
          showNotification(
            `🎯 ¡Felicitaciones! Has completado tu meta ${goalTypeLabel} de ${goal.targetMinutes} minutos`,
            'success',
            7000
          );
        });
      }

      // Resetear el temporizador y el formulario
      setIsRunning(false);
      setIsPaused(false);
      setElapsedSeconds(0);
      setSelectedExercises([]);
      setNotes('');
      setShowSaveDialog(false);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Error al guardar la sesión',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  }, [elapsedSeconds, selectedExercises, notes, showNotification]);

  const handleCloseSaveDialog = useCallback(() => {
    if (!isSaving) {
      setShowSaveDialog(false);
    }
  }, [isSaving]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Temporizador de Práctica
        </Typography>

        <Grid container spacing={3}>
          {/* Temporizador */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tiempo de Práctica
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 120,
                    my: 2,
                  }}
                >
                  <Typography
                    variant="h2"
                    component="div"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: isRunning && !isPaused ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {formatTime(elapsedSeconds)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {!isRunning ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<PlayIcon />}
                      onClick={startTimer}
                      aria-label="Iniciar temporizador"
                    >
                      Iniciar
                    </Button>
                  ) : (
                    <>
                      {isPaused ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<PlayIcon />}
                          onClick={resumeTimer}
                          aria-label="Reanudar temporizador"
                        >
                          Reanudar
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="warning"
                          size="large"
                          startIcon={<PauseIcon />}
                          onClick={pauseTimer}
                          aria-label="Pausar temporizador"
                        >
                          Pausar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<StopIcon />}
                        onClick={stopTimer}
                        aria-label="Finalizar y guardar sesión"
                      >
                        Finalizar
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Selección de ejercicios */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ejercicios de la Sesión
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Autocomplete
                      fullWidth
                      options={exercises}
                      getOptionLabel={(option) =>
                        `${option.name}${option.book ? ` - ${option.book.name}` : ''}`
                      }
                      value={exerciseToAdd}
                      onChange={(_, newValue) => setExerciseToAdd(newValue)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Seleccionar ejercicio" 
                          size="small"
                          aria-label="Buscar y seleccionar ejercicio"
                        />
                      )}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addExercise}
                      startIcon={<AddIcon />}
                      aria-label="Agregar ejercicio seleccionado"
                    >
                      Agregar
                    </Button>
                  </Box>
                </Box>

                {selectedExercises.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No hay ejercicios agregados. Agrega ejercicios para registrar tu práctica.
                  </Typography>
                ) : (
                  <List>
                    {selectedExercises.map((exercise) => (
                      <ListItem
                        key={exercise.exerciseId}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="eliminar"
                            onClick={() => removeExercise(exercise.exerciseId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={exercise.name}
                          secondary={
                            <TextField
                              type="number"
                              label="Duración (minutos)"
                              size="small"
                              value={exercise.durationMinutes}
                              onChange={(e) =>
                                updateExerciseDuration(
                                  exercise.exerciseId,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              inputProps={{ 
                                min: 0,
                                'aria-label': `Duración en minutos para ${exercise.name}`
                              }}
                              sx={{ mt: 1, width: 150 }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de guardado */}
      <Dialog 
        open={showSaveDialog} 
        onClose={handleCloseSaveDialog} 
        maxWidth="sm" 
        fullWidth
        aria-labelledby="save-session-dialog-title"
        aria-describedby="save-session-dialog-description"
      >
        <DialogTitle id="save-session-dialog-title">Guardar Sesión de Práctica</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }} id="save-session-dialog-description">
            <Typography variant="body1" gutterBottom>
              <strong>Duración:</strong> {formatTime(elapsedSeconds)} ({Math.round(elapsedSeconds / 60)}{' '}
              minutos)
            </Typography>

            {selectedExercises.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Ejercicios:</strong>
                </Typography>
                <List dense>
                  {selectedExercises.map((exercise) => (
                    <ListItem key={exercise.exerciseId}>
                      <ListItemText
                        primary={exercise.name}
                        secondary={`${exercise.durationMinutes} minutos`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notas (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Agrega notas sobre tu sesión de práctica..."
              aria-label="Notas de la sesión"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={saveSession}
            variant="contained"
            color="primary"
            disabled={isSaving}
            aria-label={isSaving ? 'Guardando sesión...' : 'Guardar sesión'}
          >
            {isSaving ? 'Guardando...' : 'Guardar Sesión'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PracticeTimer;

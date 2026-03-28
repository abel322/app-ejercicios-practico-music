import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Alert,
  Paper,
  Chip,
  Rating,
  FormLabel,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { exerciseService } from '../services/exerciseService';
import { bookService } from '../services/bookService';
import { sessionService } from '../services/sessionService';
import { useNotification } from '../contexts/NotificationContext';
import PDFViewer from '../components/PDFViewer';
import Metronome from '../components/Metronome';
import type { Exercise } from '../types/exercise.types';
import type { Book } from '../types/book.types';

// Tipo para la referencia del metrónomo
interface MetronomeRef {
  start: () => void;
  stop: () => void;
  isPlaying: () => boolean;
}

interface PracticeSessionProps {
  instrument?: string;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ instrument }) => {
  // Estado del ejercicio seleccionado
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(true);

  // Estado del temporizador
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState<number>(5); // Tiempo objetivo
  const [targetSeconds, setTargetSeconds] = useState<number>(0); // Calculado
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  // Estado del metrónomo
  const [currentTempo, setCurrentTempo] = useState(120);
  const metronomeRef = useRef<MetronomeRef>(null);

  // Estado del modal de reflexión
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflection, setReflection] = useState({
    difficulty: 3, // 1-5
    progress: 3, // 1-5
    notes: '',
    challenges: '',
    achievements: '',
  });

  // Estado del formulario de guardado
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showNotification } = useNotification();

  // Helper para obtener nombre del instrumento
  const getInstrumentName = (instrumentId: string) => {
    const names: Record<string, string> = {
      PIANO: 'Piano',
      GUITAR: 'Guitarra', 
      DRUMS: 'Batería',
      BASS: 'Bajo'
    };
    return names[instrumentId] || instrumentId;
  };

  // Cargar ejercicios
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await exerciseService.getExercises();
        // Filtrar por instrumento si se especifica
        const filteredData = instrument 
          ? data.filter(exercise => exercise.book?.instrument === instrument)
          : data;
        setExercises(filteredData);
      } catch (error) {
        showNotification('Error al cargar ejercicios', 'error');
      }
    };
    loadExercises();
  }, [showNotification, instrument]);

  // Cargar el libro cuando se selecciona un ejercicio
  useEffect(() => {
    const loadBook = async () => {
      if (selectedExercise?.bookId) {
        try {
          const book = await bookService.getBook(selectedExercise.bookId);
          setSelectedBook(book);
        } catch (error) {
          showNotification('Error al cargar el libro del ejercicio', 'error');
        }
      } else {
        setSelectedBook(null);
      }
    };
    loadBook();
  }, [selectedExercise, showNotification]);

  // Temporizador
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          const newSeconds = prev + 1;
          
          // Verificar si se alcanzó el tiempo objetivo
          if (targetSeconds > 0 && newSeconds >= targetSeconds) {
            // Detener todo inmediatamente
            setIsRunning(false);
            setIsPaused(false);
            
            // Detener metrónomo
            if (metronomeRef.current) {
              metronomeRef.current.stop();
            }
            
            // Mostrar modal
            setShowReflectionModal(true);
            
            return targetSeconds;
          }
          
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused, targetSeconds]);

  // Advertencia antes de salir
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning || elapsedSeconds > 0) {
        e.preventDefault();
        e.returnValue = '¿Deseas guardar la sesión de práctica antes de salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning, elapsedSeconds]);

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Funciones del temporizador
  const startTimer = useCallback(() => {
    if (!selectedExercise) {
      showNotification('Selecciona un ejercicio primero', 'warning');
      return;
    }
    
    // Calcular segundos objetivo
    const seconds = targetMinutes * 60;
    setTargetSeconds(seconds);
    
    // Iniciar todo sincronizado
    setShowExerciseSelector(false);
    setIsRunning(true);
    setIsPaused(false);
    
    // Iniciar metrónomo usando la referencia
    if (metronomeRef.current) {
      metronomeRef.current.start();
    }
  }, [selectedExercise, targetMinutes, showNotification]);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    // Pausar metrónomo
    if (metronomeRef.current) {
      metronomeRef.current.stop();
    }
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
    // Reanudar metrónomo
    if (metronomeRef.current) {
      metronomeRef.current.start();
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (elapsedSeconds === 0) {
      showNotification('No hay tiempo registrado para guardar', 'warning');
      return;
    }
    
    // Detener todo inmediatamente
    setIsRunning(false);
    setIsPaused(false);
    
    // Detener metrónomo
    if (metronomeRef.current) {
      metronomeRef.current.stop();
    }
    
    // Mostrar modal
    setShowReflectionModal(true);
  }, [elapsedSeconds, showNotification]);

  // Función para guardar sesión
  const saveSession = useCallback(async () => {
    if (!selectedExercise) return;

    setIsSaving(true);
    try {
      const durationMinutes = Math.round(elapsedSeconds / 60);

      const sessionData = {
        date: new Date().toISOString(),
        durationMinutes,
        exercises: [
          {
            exerciseId: selectedExercise.id,
            durationMinutes,
          },
        ],
        notes: notes.trim(),
      };

      const response = await sessionService.createSession(sessionData);

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
      }

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

      // Resetear
      setIsRunning(false);
      setIsPaused(false);
      setElapsedSeconds(0);
      setNotes('');
      setShowSaveDialog(false);
      setShowExerciseSelector(true);
      setSelectedExercise(null);
      setSelectedBook(null);
    } catch (error: any) {
      showNotification(
        error.message || 'Error al guardar la sesión',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  }, [elapsedSeconds, selectedExercise, notes, showNotification]);

  const handleCloseSaveDialog = useCallback(() => {
    if (!isSaving) {
      setShowSaveDialog(false);
    }
  }, [isSaving]);

  const handleChangeExercise = useCallback(() => {
    if (isRunning || elapsedSeconds > 0) {
      if (window.confirm('¿Deseas cambiar de ejercicio? Se perderá el progreso actual.')) {
        setIsRunning(false);
        setIsPaused(false);
        setElapsedSeconds(0);
        setShowExerciseSelector(true);
        setSelectedExercise(null);
        setSelectedBook(null);
      }
    } else {
      setShowExerciseSelector(true);
      setSelectedExercise(null);
      setSelectedBook(null);
    }
  }, [isRunning, elapsedSeconds]);

  // Funciones del modal de reflexión
  const handleSaveReflection = useCallback(async () => {
    setIsSaving(true);
    try {
      const durationMinutes = Math.round(elapsedSeconds / 60);

      // Crear notas combinadas con la reflexión
      const combinedNotes = `
📊 Reflexión de Práctica:
- Dificultad percibida: ${reflection.difficulty}/5
- Progreso sentido: ${reflection.progress}/5

💭 Notas generales:
${reflection.notes || 'Sin notas'}

🎯 Logros:
${reflection.achievements || 'Sin logros registrados'}

⚠️ Desafíos:
${reflection.challenges || 'Sin desafíos registrados'}

⏱️ Tempo usado: ${currentTempo} BPM
      `.trim();

      const sessionData = {
        date: new Date().toISOString(),
        durationMinutes,
        exercises: [
          {
            exerciseId: selectedExercise!.id,
            durationMinutes,
          },
        ],
        notes: combinedNotes,
      };

      const response = await sessionService.createSession(sessionData);

      showNotification('¡Sesión guardada exitosamente!', 'success');

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
      }

      if (response.goalsCompleted && response.goalsCompleted.length > 0) {
        response.goalsCompleted.forEach((goal) => {
          const goalTypeLabel = goal.type === 'DAILY' ? 'diaria' : 'semanal';
          showNotification(
            `🎯 ¡Meta ${goalTypeLabel} completada! (${goal.targetMinutes} min)`,
            'success',
            7000
          );
        });
      }

      // Resetear todo
      setShowReflectionModal(false);
      setIsRunning(false);
      setIsPaused(false);
      setElapsedSeconds(0);
      setTargetSeconds(0);
      setReflection({
        difficulty: 3,
        progress: 3,
        notes: '',
        challenges: '',
        achievements: '',
      });
      setShowExerciseSelector(true);
      setSelectedExercise(null);
      setSelectedBook(null);
    } catch (error: any) {
      showNotification(
        error.message || 'Error al guardar la sesión',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  }, [elapsedSeconds, selectedExercise, reflection, currentTempo, showNotification]);

  const handleSkipReflection = useCallback(() => {
    setShowReflectionModal(false);
    setShowSaveDialog(true);
  }, []);

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Sin header - Máxima visualización */}

      {/* Selector de ejercicio */}
      {showExerciseSelector && (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 3,
        }}>
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selecciona un Ejercicio
                {instrument && (
                  <Chip 
                    label={getInstrumentName(instrument)} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 2 }} 
                  />
                )}
              </Typography>
              <Autocomplete
                fullWidth
                options={exercises}
                getOptionLabel={(option) =>
                  `${option.name}${option.book ? ` - ${option.book.name}` : ''} (Páginas: ${option.pages})`
                }
                value={selectedExercise}
                onChange={(_, newValue) => {
                  setSelectedExercise(newValue);
                  if (newValue) {
                    setShowTimeSelector(true);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar ejercicio"
                    placeholder="Escribe para buscar..."
                  />
                )}
              />
              
              {/* Selector de tiempo objetivo */}
              {showTimeSelector && selectedExercise && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    ¿Cuánto tiempo quieres practicar?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {[1, 5, 10, 15, 20, 30].map((minutes) => (
                      <Chip
                        key={minutes}
                        label={`${minutes} min`}
                        onClick={() => setTargetMinutes(minutes)}
                        color={targetMinutes === minutes ? 'primary' : 'default'}
                        variant={targetMinutes === minutes ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                  <TextField
                    label="Tiempo personalizado (minutos)"
                    type="number"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 120 }}
                    size="small"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setShowExerciseSelector(false);
                      setShowTimeSelector(false);
                    }}
                  >
                    Continuar
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Vista de práctica */}
      {selectedExercise && !showExerciseSelector && (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          overflow: 'hidden',
          gap: 0.5,
          p: 0.5,
          minHeight: 0, // IMPORTANTE para que flex funcione
        }}>
          {/* Columna izquierda: Información, Temporizador, PDF */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            gap: 0.5,
            minWidth: 0,
            minHeight: 0, // IMPORTANTE
          }}>
            {/* Información del ejercicio y Temporizador - Ultra compacta */}
            <Paper sx={{ p: 0.75, flexShrink: 0 }} elevation={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body1" noWrap fontWeight={600}>
                    {selectedExercise.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {selectedBook && (
                      <Chip
                        icon={<BookIcon sx={{ fontSize: 14 }} />}
                        label={selectedBook.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                    <Chip
                      label={`Pág: ${selectedExercise.pages}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={selectedExercise.difficulty}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleChangeExercise}
                  size="small"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Cambiar
                </Button>
              </Box>

              {/* Temporizador integrado */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: 1.5,
                  pt: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Tiempo:
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: isRunning && !isPaused ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {formatTime(elapsedSeconds)}
                  </Typography>
                  {targetSeconds > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      / {formatTime(targetSeconds)}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {!isRunning ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayIcon />}
                      onClick={startTimer}
                      size="small"
                      sx={{ minWidth: 'auto', px: 1.5 }}
                    >
                      Iniciar
                    </Button>
                  ) : (
                    <>
                      {isPaused ? (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PlayIcon />}
                          onClick={resumeTimer}
                          size="small"
                          sx={{ minWidth: 'auto', px: 1.5 }}
                        >
                          Reanudar
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="warning"
                          startIcon={<PauseIcon />}
                          onClick={pauseTimer}
                          size="small"
                          sx={{ minWidth: 'auto', px: 1.5 }}
                        >
                          Pausar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<StopIcon />}
                        onClick={stopTimer}
                        size="small"
                        sx={{ minWidth: 'auto', px: 1.5 }}
                      >
                        Finalizar
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Visualizador de PDF - Usa flex para ocupar espacio restante */}
            {selectedBook && (
              <Box sx={{ 
                flex: 1,
                minHeight: 0, // CRÍTICO para que flex funcione
                overflow: 'hidden',
              }}>
                <PDFViewer 
                  fileUrl={selectedBook.fileUrl} 
                  pageRange={selectedExercise.pages}
                />
              </Box>
            )}

            {!selectedBook && (
              <Alert severity="info" sx={{ m: 0 }}>
                No se encontró el libro asociado a este ejercicio.
              </Alert>
            )}
          </Box>

          {/* Columna derecha: Metrónomo */}
          <Box sx={{ 
            width: { xs: '100%', lg: 320 },
            flexShrink: 0,
            overflow: 'hidden',
            minHeight: 0,
          }}>
            <Metronome
              ref={metronomeRef}
              initialTempo={currentTempo}
              onTempoChange={setCurrentTempo}
            />
          </Box>
        </Box>
      )}

      {/* Modal de Reflexión */}
      <Dialog
        open={showReflectionModal}
        onClose={() => {}}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🎯 ¡Tiempo completado!
            <Chip label={`${targetMinutes} min`} size="small" color="success" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Excelente trabajo! Completaste {targetMinutes} minutos de práctica enfocada.
            </Alert>

            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Reflexiona sobre tu práctica:
            </Typography>

            {/* Dificultad */}
            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">¿Qué tan difícil fue el ejercicio?</FormLabel>
              <Rating
                value={reflection.difficulty}
                onChange={(_, value) => setReflection({ ...reflection, difficulty: value || 3 })}
                max={5}
                size="large"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Muy fácil</Typography>
                <Typography variant="caption" color="text.secondary">Muy difícil</Typography>
              </Box>
            </Box>

            {/* Progreso */}
            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">¿Cuánto progreso sientes que hiciste?</FormLabel>
              <Rating
                value={reflection.progress}
                onChange={(_, value) => setReflection({ ...reflection, progress: value || 3 })}
                max={5}
                size="large"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Ninguno</Typography>
                <Typography variant="caption" color="text.secondary">Mucho</Typography>
              </Box>
            </Box>

            {/* Logros */}
            <TextField
              fullWidth
              multiline
              rows={2}
              label="¿Qué lograste en esta sesión?"
              value={reflection.achievements}
              onChange={(e) => setReflection({ ...reflection, achievements: e.target.value })}
              placeholder="Ej: Logré tocar el patrón a 100 BPM sin errores"
              sx={{ mb: 2 }}
            />

            {/* Desafíos */}
            <TextField
              fullWidth
              multiline
              rows={2}
              label="¿Qué desafíos encontraste?"
              value={reflection.challenges}
              onChange={(e) => setReflection({ ...reflection, challenges: e.target.value })}
              placeholder="Ej: Me costó mantener el tempo en las transiciones"
              sx={{ mb: 2 }}
            />

            {/* Notas adicionales */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notas adicionales (opcional)"
              value={reflection.notes}
              onChange={(e) => setReflection({ ...reflection, notes: e.target.value })}
              placeholder="Cualquier otra observación sobre tu práctica..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSkipReflection} disabled={isSaving}>
            Omitir reflexión
          </Button>
          <Button
            onClick={handleSaveReflection}
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Sesión'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de guardado */}
      <Dialog
        open={showSaveDialog}
        onClose={handleCloseSaveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Guardar Sesión de Práctica</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Ejercicio:</strong> {selectedExercise?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Duración:</strong> {formatTime(elapsedSeconds)} ({Math.round(elapsedSeconds / 60)} minutos)
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notas (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Agrega notas sobre tu sesión de práctica..."
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
          >
            {isSaving ? 'Guardando...' : 'Guardar Sesión'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PracticeSession;

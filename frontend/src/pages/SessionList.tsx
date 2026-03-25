import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  FitnessCenter as ExerciseIcon,
} from '@mui/icons-material';
import { sessionService } from '../services/sessionService';
import { useNotification } from '../contexts/NotificationContext';
import SessionForm from '../components/SessionForm';
import type { Session, SessionFormData, SessionUpdateData } from '../types/session.types';

const SESSIONS_PER_PAGE = 20;

interface SessionListProps {
  instrument?: string;
}

const SessionList: React.FC<SessionListProps> = ({ instrument }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
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

  // Cargar sesiones
  const loadSessions = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * SESSIONS_PER_PAGE;
      const result = await sessionService.getSessions(
        startDate || undefined,
        endDate || undefined,
        SESSIONS_PER_PAGE,
        offset
      );
      
      // Filtrar sesiones por instrumento si se especifica
      let filteredSessions = result.sessions;
      if (instrument) {
        filteredSessions = result.sessions.filter(session => 
          session.exercises.some(se => 
            se.exercise?.book?.instrument === instrument
          )
        );
      }
      
      setSessions(filteredSessions);
      setTotalPages(Math.ceil((instrument ? filteredSessions.length : result.total) / SESSIONS_PER_PAGE));
    } catch (error) {
      console.error('Error loading sessions:', error);
      showNotification('Error al cargar las sesiones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [page, startDate, endDate, instrument]); // Recargar cuando cambie el instrumento

  // Verificar si una sesión puede ser editada (< 24 horas)
  const canEdit = (session: Session): boolean => {
    const createdAt = new Date(session.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  // Crear sesión
  const handleCreateSession = async (data: SessionFormData) => {
    try {
      const response = await sessionService.createSession(data);
      
      showNotification('Sesión registrada exitosamente', 'success');
      
      // Notificar cambios especiales
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
      
      loadSessions();
    } catch (error: any) {
      console.error('Error creating session:', error);
      const message = error.response?.data?.message || 'Error al crear la sesión';
      showNotification(message, 'error');
      throw error;
    }
  };

  // Editar sesión
  const handleEditSession = async (data: SessionFormData) => {
    if (!selectedSession) return;

    try {
      const updateData: SessionUpdateData = {
        durationMinutes: data.durationMinutes,
        exercises: data.exercises,
        notes: data.notes,
      };

      await sessionService.updateSession(selectedSession.id, updateData);
      showNotification('Sesión actualizada exitosamente', 'success');
      loadSessions();
    } catch (error: any) {
      console.error('Error updating session:', error);
      const message = error.response?.data?.message || 'Error al actualizar la sesión';
      showNotification(message, 'error');
      throw error;
    }
  };

  // Eliminar sesión
  const handleDeleteSession = async () => {
    if (!selectedSession) return;

    try {
      await sessionService.deleteSession(selectedSession.id);
      showNotification('Sesión eliminada exitosamente', 'success');
      setDeleteDialogOpen(false);
      setSelectedSession(null);
      loadSessions();
    } catch (error: any) {
      console.error('Error deleting session:', error);
      const message = error.response?.data?.message || 'Error al eliminar la sesión';
      showNotification(message, 'error');
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Formatear duración
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    setPage(1);
    loadSessions();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Sesiones de Práctica
              {instrument && (
                <Chip 
                  label={getInstrumentName(instrument)} 
                  color="primary" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Historial de tus sesiones de práctica{instrument ? ` de ${getInstrumentName(instrument)}` : ''}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Nueva Sesión
          </Button>
        </Box>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Fecha inicio"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Fecha fin"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleApplyFilters}
                    fullWidth
                  >
                    Aplicar
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleClearFilters}
                    fullWidth
                  >
                    Limpiar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lista de sesiones */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : sessions.length === 0 ? (
          <Alert severity="info">
            No se encontraron sesiones. ¡Registra tu primera sesión de práctica!
          </Alert>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        {/* Fecha y duración */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<CalendarIcon />}
                            label={formatDate(session.date)}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            icon={<TimerIcon />}
                            label={formatDuration(session.durationMinutes)}
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>

                        {/* Ejercicios */}
                        {session.exercises && session.exercises.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              <ExerciseIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                              Ejercicios:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 3 }}>
                              {session.exercises.map((se) => (
                                <Typography key={se.id} variant="body2">
                                  • {se.exercise?.name || 'Ejercicio'} - {formatDuration(se.durationMinutes)}
                                  {se.exercise?.book && (
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ ml: 1 }}
                                    >
                                      ({se.exercise.book.name}
                                      {se.exercise.book.instrument && (
                                        <Chip 
                                          label={getInstrumentName(se.exercise.book.instrument)} 
                                          size="small" 
                                          color="secondary" 
                                          sx={{ ml: 0.5, height: 14, fontSize: '0.55rem' }} 
                                        />
                                      )})
                                    </Typography>
                                  )}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Notas */}
                        {session.notes && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Notas:
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 2 }}>
                              {session.notes}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Acciones */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => {
                            setSelectedSession(session);
                            setEditDialogOpen(true);
                          }}
                          disabled={!canEdit(session)}
                          color="primary"
                          title={
                            canEdit(session)
                              ? 'Editar sesión'
                              : 'Solo se puede editar dentro de las 24 horas'
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedSession(session);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Paginación */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Diálogo de crear sesión */}
        <SessionForm
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateSession}
          title={`Registrar Nueva Sesión${instrument ? ` - ${getInstrumentName(instrument)}` : ''}`}
          instrument={instrument}
        />

        {/* Diálogo de editar sesión */}
        {selectedSession && (
          <SessionForm
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedSession(null);
            }}
            onSubmit={handleEditSession}
            initialData={{
              date: selectedSession.date,
              durationMinutes: selectedSession.durationMinutes,
              exercises: selectedSession.exercises.map((se) => ({
                exerciseId: se.exerciseId,
                durationMinutes: se.durationMinutes,
              })),
              notes: selectedSession.notes,
            }}
            title="Editar Sesión"
            instrument={instrument}
          />
        )}

        {/* Diálogo de confirmación de eliminación */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedSession(null);
          }}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedSession(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleDeleteSession} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default SessionList;

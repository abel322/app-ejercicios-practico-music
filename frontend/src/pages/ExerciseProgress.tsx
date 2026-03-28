import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  PlayCircle,
  RadioButtonUnchecked,
  Speed,
  Timer,
  TrendingUp,
} from '@mui/icons-material';
import { exerciseProgressService } from '../services/exerciseProgressService';
import type { ExerciseProgress } from '../types/exercise-progress.types';
import { ExerciseStatus } from '../types/exercise-progress.types';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';

interface ExerciseProgressPageProps {
  instrument?: string;
}

const ExerciseProgressPage: React.FC<ExerciseProgressPageProps> = ({ instrument }) => {
  const [progressList, setProgressList] = useState<ExerciseProgress[]>([]);
  const [filteredList, setFilteredList] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    notStarted: 0,
    inProgress: 0,
    mastered: 0,
    totalPracticeHours: 0,
  });

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

  useEffect(() => {
    loadData();
  }, [instrument]); // Recargar cuando cambie el instrumento

  useEffect(() => {
    filterByStatus();
  }, [currentTab, progressList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [progress, statistics] = await Promise.all([
        exerciseProgressService.getAllProgress(),
        exerciseProgressService.getStatistics(),
      ]);
      
      // Filtrar por instrumento si se especifica
      const filteredProgress = instrument 
        ? progress.filter(p => p.exercise?.book?.instrument === instrument)
        : progress;
      
      setProgressList(filteredProgress);
      
      // Recalcular estadísticas para el instrumento específico
      if (instrument) {
        const instrumentStats = {
          total: filteredProgress.length,
          notStarted: filteredProgress.filter(p => p.status === ExerciseStatus.NOT_STARTED).length,
          inProgress: filteredProgress.filter(p => p.status === ExerciseStatus.IN_PROGRESS).length,
          mastered: filteredProgress.filter(p => p.status === ExerciseStatus.MASTERED).length,
          totalPracticeHours: filteredProgress.reduce((acc, p) => acc + (p.totalPracticeTime / 3600), 0),
        };
        setStats(instrumentStats);
      } else {
        setStats(statistics);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = () => {
    if (currentTab === 0) {
      setFilteredList(progressList);
    } else if (currentTab === 1) {
      setFilteredList(progressList.filter((p) => p.status === ExerciseStatus.IN_PROGRESS));
    } else if (currentTab === 2) {
      setFilteredList(progressList.filter((p) => p.status === ExerciseStatus.MASTERED));
    } else {
      setFilteredList(progressList.filter((p) => p.status === ExerciseStatus.NOT_STARTED));
    }
  };

  const getStatusIcon = (status: ExerciseStatus) => {
    switch (status) {
      case ExerciseStatus.MASTERED:
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case ExerciseStatus.IN_PROGRESS:
        return <PlayCircle sx={{ color: 'primary.main' }} />;
      default:
        return <RadioButtonUnchecked sx={{ color: 'text.secondary' }} />;
    }
  };

  const getStatusLabel = (status: ExerciseStatus) => {
    switch (status) {
      case ExerciseStatus.MASTERED:
        return 'Dominado';
      case ExerciseStatus.IN_PROGRESS:
        return 'En Progreso';
      default:
        return 'No Iniciado';
    }
  };

  const getStatusColor = (status: ExerciseStatus) => {
    switch (status) {
      case ExerciseStatus.MASTERED:
        return 'success';
      case ExerciseStatus.IN_PROGRESS:
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calculateProgress = (progress: ExerciseProgress) => {
    if (!progress.exercise?.targetTempo || !progress.exercise?.minMasteryTime) {
      return 0;
    }
    const tempoProgress = progress.currentTempo
      ? (progress.currentTempo / progress.exercise.targetTempo) * 50
      : 0;
    const timeProgress = (progress.masteryTime / progress.exercise.minMasteryTime) * 50;
    return Math.min(tempoProgress + timeProgress, 100);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Progreso de Ejercicios
          {instrument && (
            <Chip 
              label={getInstrumentName(instrument)} 
              color="primary" 
              sx={{ ml: 2 }} 
            />
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rastrea tu dominio de ejercicios{instrument ? ` de ${getInstrumentName(instrument)}` : ''} con tempo y tiempo de práctica
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total"
            value={stats.total}
            icon={<TrendingUp />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="En Progreso"
            value={stats.inProgress}
            icon={<PlayCircle />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Dominados"
            value={stats.mastered}
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Horas Totales"
            value={stats.totalPracticeHours.toFixed(1)}
            icon={<Timer />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Tabs de filtro */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Todos" />
          <Tab label="En Progreso" />
          <Tab label="Dominados" />
          <Tab label="No Iniciados" />
        </Tabs>
      </Box>

      {/* Lista de ejercicios */}
      <Grid container spacing={3}>
        {filteredList.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No hay ejercicios en esta categoría{instrument ? ` para ${getInstrumentName(instrument)}` : ''}
            </Alert>
          </Grid>
        ) : (
          filteredList.map((progress) => (
            <Grid item xs={12} md={6} key={progress.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{getStatusIcon(progress.status)}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {progress.exercise?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {progress.exercise?.book.name}
                        {progress.exercise?.book?.instrument && (
                          <Chip 
                            label={getInstrumentName(progress.exercise.book.instrument)} 
                            size="small" 
                            color="secondary" 
                            sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
                          />
                        )}
                      </Typography>
                      <Chip
                        label={getStatusLabel(progress.status)}
                        color={getStatusColor(progress.status) as any}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>

                  {/* Barra de progreso */}
                  {progress.exercise?.targetTempo && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progreso
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {calculateProgress(progress).toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(progress)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  {/* Información de tempo y tiempo */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Speed fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Tempo Actual
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {progress.currentTempo || 0} BPM
                            {progress.exercise?.targetTempo && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {' '}
                                / {progress.exercise.targetTempo}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer fontSize="small" color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Tiempo al Objetivo
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatTime(progress.masteryTime)}
                            {progress.exercise?.minMasteryTime && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {' '}
                                / {formatTime(progress.exercise.minMasteryTime)}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Tiempo total practicado */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Tiempo total practicado: {formatTime(progress.totalPracticeTime)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default ExerciseProgressPage;

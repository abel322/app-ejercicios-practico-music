import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Timer,
  TrendingUp,
  CalendarToday,
  LocalFireDepartment,
  EventNote,
  Piano as PianoIcon,
  MusicNote as GuitarIcon,
  Album as DrumsIcon,
  GraphicEq as BassIcon,
  Dashboard as DashboardIcon,
  EmojiEvents,
  Timeline,
} from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import PracticeChart from '../components/PracticeChart';
import InstrumentDistribution from '../components/InstrumentDistribution';
import TopExercises from '../components/TopExercises';
import GoalProgress from '../components/GoalProgress';
import RecommendationsPreview from '../components/RecommendationsPreview';
import PredictionPreview from '../components/PredictionPreview';
import LiveRegion from '../components/LiveRegion';
import { dashboardService } from '../services/dashboardService';
import { goalService } from '../services/goalService';
import { levelService } from '../services/levelService';
import { predictionService } from '../services/predictionService';
import { useNotification } from '../contexts/NotificationContext';
import type {
  DashboardStats,
  PracticeChartData,
  InstrumentDistributionData,
  TopExercise,
  DateRangeFilter,
} from '../types/dashboard.types';
import type { GoalWithProgress } from '../types/goal.types';
import type { CurrentLevelResponse } from '../types/level.types';
import type { PredictionResponse } from '../types/prediction.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface Instrument {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
}

const instruments: Instrument[] = [
  { id: 'PIANO', name: 'Piano', icon: <PianoIcon />, color: '#6366F1' },
  { id: 'GUITAR', name: 'Guitarra', icon: <GuitarIcon />, color: '#EC4899' },
  { id: 'DRUMS', name: 'Batería', icon: <DrumsIcon />, color: '#F59E0B' },
  { id: 'BASS', name: 'Bajo', icon: <BassIcon />, color: '#10B981' },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { showNotification } = useNotification();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [liveMessage, setLiveMessage] = useState('');

  // General data
  const [generalStats, setGeneralStats] = useState<DashboardStats | null>(null);
  const [generalChartData, setGeneralChartData] = useState<PracticeChartData[]>([]);
  const [instrumentData, setInstrumentData] = useState<InstrumentDistributionData[]>([]);
  const [generalTopExercises, setGeneralTopExercises] = useState<TopExercise[]>([]);

  // Instrument-specific data
  const [instrumentStats, setInstrumentStats] = useState<Record<string, DashboardStats>>({});
  const [instrumentChartData, setInstrumentChartData] = useState<Record<string, PracticeChartData[]>>({});
  const [instrumentTopExercises, setInstrumentTopExercises] = useState<Record<string, TopExercise[]>>({});
  const [instrumentLevels, setInstrumentLevels] = useState<Record<string, CurrentLevelResponse>>({});
  const [instrumentPredictions, setInstrumentPredictions] = useState<Record<string, PredictionResponse>>({});
  const [instrumentGoals, setInstrumentGoals] = useState<Record<string, GoalWithProgress | null>>({});

  // Load general dashboard data
  const loadGeneralData = async (filters?: DateRangeFilter) => {
    try {
      setLoading(true);
      setLiveMessage('Cargando estadísticas generales...');
      
      // For general data, we don't pass instrument filter
      const generalFilters = filters ? { 
        startDate: filters.startDate, 
        endDate: filters.endDate 
      } : undefined;
      
      const [statsData, chartResponse, instrumentResponse, exercisesResponse] = await Promise.all([
        dashboardService.getStats(generalFilters),
        dashboardService.getPracticeChart(generalFilters),
        dashboardService.getInstrumentDistribution(generalFilters),
        dashboardService.getTopExercises(generalFilters),
      ]);

      setGeneralStats(statsData);
      setGeneralChartData(chartResponse.data);
      setInstrumentData(instrumentResponse.data);
      setGeneralTopExercises(exercisesResponse.exercises);
      setLiveMessage('Estadísticas generales cargadas');
    } catch (error) {
      console.error('Error loading general data:', error);
      showNotification('Error al cargar las estadísticas generales', 'error');
      setLiveMessage('Error al cargar las estadísticas generales');
    } finally {
      setLoading(false);
    }
  };

  // Load instrument-specific data
  const loadInstrumentData = async (instrument: string, filters?: DateRangeFilter) => {
    try {
      setLiveMessage(`Cargando datos de ${instruments.find(i => i.id === instrument)?.name}...`);
      
      // Create instrument-specific filters
      const instrumentFilters = {
        ...filters,
        instrument
      };
      
      const [statsData, chartResponse, exercisesResponse, levelData, predictionData, goals] = await Promise.all([
        dashboardService.getStats(instrumentFilters),
        dashboardService.getPracticeChart(instrumentFilters),
        dashboardService.getTopExercises(instrumentFilters),
        levelService.getCurrentLevel(instrument).catch(() => null),
        predictionService.getNextLevelPrediction(instrument).catch(() => null),
        goalService.getGoals(true, instrument).catch(() => []),
      ]);

      setInstrumentStats(prev => ({ ...prev, [instrument]: statsData }));
      setInstrumentChartData(prev => ({ ...prev, [instrument]: chartResponse.data }));
      setInstrumentTopExercises(prev => ({ ...prev, [instrument]: exercisesResponse.exercises }));
      
      if (levelData) {
        setInstrumentLevels(prev => ({ ...prev, [instrument]: levelData }));
      }
      
      if (predictionData) {
        setInstrumentPredictions(prev => ({ ...prev, [instrument]: predictionData }));
      }

      // Get active goal for instrument
      if (goals.length > 0) {
        const goalWithProgress = await goalService.getGoal(goals[0].id);
        setInstrumentGoals(prev => ({ ...prev, [instrument]: goalWithProgress }));
      } else {
        setInstrumentGoals(prev => ({ ...prev, [instrument]: null }));
      }

    } catch (error) {
      console.error(`Error loading ${instrument} data:`, error);
      showNotification(`Error al cargar datos de ${instruments.find(i => i.id === instrument)?.name}`, 'error');
    }
  };

  // Load all data
  const loadAllData = async (filters?: DateRangeFilter) => {
    await loadGeneralData(filters);
    
    // Load instrument data in parallel
    const instrumentPromises = instruments.map(instrument => 
      loadInstrumentData(instrument.id, filters)
    );
    await Promise.all(instrumentPromises);
    
    setLiveMessage('Todos los datos cargados correctamente');
  };

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Apply date filters
  const handleApplyFilters = () => {
    const filters: DateRangeFilter = {};
    if (startDate) {
      filters.startDate = startDate;
    }
    if (endDate) {
      filters.endDate = endDate;
    }
    loadAllData(filters);
  };

  // Clear filters
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    loadAllData();
  };

  // Format time for display
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Get level label
  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      BASIC: 'Básico',
      INTERMEDIATE: 'Intermedio',
      ADVANCED: 'Avanzado',
    };
    return labels[level] || level;
  };

  // Check if there's no data
  const hasNoData = generalStats && generalStats.totalSessions === 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <LiveRegion message={liveMessage} />
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            Dashboard Profesional
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualiza tus estadísticas de práctica por instrumento de manera profesional
          </Typography>
        </Box>

        {/* Date Filters */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday color="primary" />
            Filtros de Fecha
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fecha de inicio"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fecha de fin"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Aplicar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* No Data Message */}
        {hasNoData && (
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¡Bienvenido a tu Dashboard Profesional!
            </Typography>
            <Typography variant="body2">
              Aún no tienes sesiones de práctica registradas. Comienza tu viaje musical:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Sube tus libros de ejercicios en formato PDF</li>
              <li>Crea ejercicios asociados a tus libros</li>
              <li>Registra tus sesiones de práctica con el temporizador</li>
              <li>Visualiza tu progreso y estadísticas aquí</li>
            </Box>
          </Alert>
        )}

        {!hasNoData && (
          <>
            {/* Tabs */}
            <Paper sx={{ mb: 4 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    minHeight: 72,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  },
                }}
              >
                <Tab
                  icon={<DashboardIcon />}
                  label="General"
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
                {instruments.map((instrument, index) => (
                  <Tab
                    key={instrument.id}
                    icon={instrument.icon}
                    label={instrument.name}
                    iconPosition="start"
                    sx={{ 
                      gap: 1,
                      color: instrument.color,
                      '&.Mui-selected': {
                        color: instrument.color,
                      },
                    }}
                  />
                ))}
              </Tabs>

              {/* General Tab */}
              <TabPanel value={currentTab} index={0}>
                <Grid container spacing={3}>
                  {/* General Stats Cards */}
                  {generalStats && (
                    <>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatsCard
                          title="Tiempo Total"
                          value={formatTime(generalStats.totalMinutes)}
                          icon={<Timer />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatsCard
                          title="Promedio Diario"
                          value={formatTime(Math.round(generalStats.averageDaily))}
                          icon={<CalendarToday />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatsCard
                          title="Promedio Semanal"
                          value={formatTime(Math.round(generalStats.averageWeekly))}
                          icon={<TrendingUp />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatsCard
                          title="Racha Actual"
                          value={`${generalStats.currentStreak} días`}
                          icon={<LocalFireDepartment />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatsCard
                          title="Total Sesiones"
                          value={generalStats.totalSessions}
                          icon={<EventNote />}
                        />
                      </Grid>
                    </>
                  )}

                  {/* General Charts */}
                  <Grid item xs={12}>
                    <PracticeChart data={generalChartData} loading={loading} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InstrumentDistribution data={instrumentData} loading={loading} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TopExercises exercises={generalTopExercises} loading={loading} />
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Instrument Tabs */}
              {instruments.map((instrument, index) => (
                <TabPanel key={instrument.id} value={currentTab} index={index + 1}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      {instrument.icon}
                      Dashboard de {instrument.name}
                      <Chip
                        label={instrument.name}
                        sx={{
                          backgroundColor: instrument.color,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Box>

                  <Grid container spacing={3}>
                    {/* Instrument Stats Cards */}
                    {instrumentStats[instrument.id] && (
                      <>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <StatsCard
                            title="Tiempo Total"
                            value={formatTime(instrumentStats[instrument.id].totalMinutes)}
                            icon={<Timer />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <StatsCard
                            title="Promedio Diario"
                            value={formatTime(Math.round(instrumentStats[instrument.id].averageDaily))}
                            icon={<CalendarToday />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <StatsCard
                            title="Promedio Semanal"
                            value={formatTime(Math.round(instrumentStats[instrument.id].averageWeekly))}
                            icon={<TrendingUp />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <StatsCard
                            title="Racha Actual"
                            value={`${instrumentStats[instrument.id].currentStreak} días`}
                            icon={<LocalFireDepartment />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                          <StatsCard
                            title="Total Sesiones"
                            value={instrumentStats[instrument.id].totalSessions}
                            icon={<EventNote />}
                          />
                        </Grid>
                      </>
                    )}

                    {/* Level and Prediction Cards */}
                    {instrumentLevels[instrument.id] && (
                      <Grid item xs={12} sm={6} md={6}>
                        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${instrument.color}20 0%, ${instrument.color}10 100%)` }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <EmojiEvents sx={{ color: instrument.color }} />
                              Nivel Actual
                            </Typography>
                            <Typography variant="h4" sx={{ color: instrument.color, fontWeight: 'bold', mb: 1 }}>
                              {getLevelLabel(instrumentLevels[instrument.id].level)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Progreso hacia siguiente nivel: {instrumentLevels[instrument.id].progress.percentageToNext.toFixed(1)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {instrumentPredictions[instrument.id] && instrumentPredictions[instrument.id].prediction && (
                      <Grid item xs={12} sm={6} md={6}>
                        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${instrument.color}20 0%, ${instrument.color}10 100%)` }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Timeline sx={{ color: instrument.color }} />
                              Predicción
                            </Typography>
                            <Typography variant="h6" sx={{ color: instrument.color, fontWeight: 'bold', mb: 1 }}>
                              {getLevelLabel(instrumentPredictions[instrument.id].prediction!.nextLevel)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Fecha estimada: {new Date(instrumentPredictions[instrument.id].prediction!.estimatedDate).toLocaleDateString('es-ES')}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Active Goal */}
                    {instrumentGoals[instrument.id] && (
                      <Grid item xs={12}>
                        <GoalProgress goal={instrumentGoals[instrument.id]!} />
                      </Grid>
                    )}

                    {/* Instrument Charts */}
                    <Grid item xs={12}>
                      <PracticeChart 
                        data={instrumentChartData[instrument.id] || []} 
                        loading={loading}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TopExercises 
                        exercises={instrumentTopExercises[instrument.id] || []} 
                        loading={loading}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              ))}
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
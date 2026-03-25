import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  LocalFireDepartment,
} from '@mui/icons-material';
import { sessionService } from '../services/sessionService';
import { dashboardService } from '../services/dashboardService';
import type { Session } from '../types/session.types';

interface DayData {
  date: Date;
  totalMinutes: number;
  sessions: Session[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface PracticeCalendarProps {
  instrument?: string;
}

const PracticeCalendar: React.FC<PracticeCalendarProps> = ({ instrument }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    loadMonthSessions();
    loadStreak();
  }, [currentMonth, currentYear, instrument]); // Recargar cuando cambie el instrumento

  const loadMonthSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      
      const { sessions: fetchedSessions } = await sessionService.getSessions(
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      // Filtrar sesiones por instrumento si se especifica
      let filteredSessions = fetchedSessions;
      if (instrument) {
        filteredSessions = fetchedSessions.filter(session => 
          session.exercises.some(se => 
            se.exercise?.book?.instrument === instrument
          )
        );
      }
      
      setSessions(filteredSessions);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Error al cargar las sesiones del mes');
    } finally {
      setLoading(false);
    }
  };

  const loadStreak = async () => {
    try {
      const stats = await dashboardService.getStats();
      setStreak(stats.currentStreak || 0);
    } catch (err) {
      console.error('Error loading streak:', err);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const getDayColor = (minutes: number): 'success' | 'warning' | 'default' => {
    if (minutes > 60) return 'success';
    if (minutes >= 30) return 'warning';
    return 'default';
  };

  const getCalendarDays = (): DayData[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: DayData[] = [];
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
      days.push({
        date,
        totalMinutes: 0,
        sessions: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Días del mes actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });
      
      const totalMinutes = daySessions.reduce(
        (sum, session) => sum + session.durationMinutes,
        0
      );
      
      days.push({
        date,
        totalMinutes,
        sessions: daySessions,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
      });
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        totalMinutes: 0,
        sessions: [],
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return days;
  };

  const handleDayClick = (dayData: DayData) => {
    if (dayData.isCurrentMonth && dayData.sessions.length > 0) {
      setSelectedDay(dayData);
      setShowDayDetail(true);
    }
  };

  const handleCloseDetail = () => {
    setShowDayDetail(false);
    setSelectedDay(null);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const calendarDays = getCalendarDays();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1">
              Calendario de Práctica
              {instrument && (
                <Typography variant="h6" component="span" color="primary" sx={{ ml: 2 }}>
                  - {getInstrumentName(instrument)}
                </Typography>
              )}
            </Typography>
          </Box>
          
          <Chip
            icon={<LocalFireDepartment />}
            label={`Racha: ${streak} ${streak === 1 ? 'día' : 'días'}`}
            color="error"
            sx={{ fontSize: '1rem', py: 2.5 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          {/* Controles de navegación */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={goToPreviousMonth} aria-label="Mes anterior">
              <ChevronLeft />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">
                {monthNames[currentMonth]} {currentYear}
              </Typography>
              <Button
                startIcon={<Today />}
                onClick={goToToday}
                variant="outlined"
                size="small"
              >
                Hoy
              </Button>
            </Box>
            
            <IconButton onClick={goToNextMonth} aria-label="Mes siguiente">
              <ChevronRight />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Nombres de los días */}
              <Grid container spacing={1} sx={{ mb: 1 }}>
                {dayNames.map((dayName) => (
                  <Grid item xs={12 / 7} key={dayName}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        py: 1,
                      }}
                    >
                      {dayName}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Días del calendario */}
              <Grid container spacing={1}>
                {calendarDays.map((dayData, index) => {
                  const hasSession = dayData.totalMinutes > 0;
                  const color = hasSession ? getDayColor(dayData.totalMinutes) : undefined;
                  
                  return (
                    <Grid item xs={12 / 7} key={index}>
                      <Box
                        onClick={() => handleDayClick(dayData)}
                        sx={{
                          aspectRatio: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 1,
                          borderColor: dayData.isToday ? 'primary.main' : 'divider',
                          borderWidth: dayData.isToday ? 2 : 1,
                          borderRadius: 1,
                          cursor: hasSession && dayData.isCurrentMonth ? 'pointer' : 'default',
                          bgcolor: hasSession
                            ? color === 'success'
                              ? 'success.light'
                              : color === 'warning'
                              ? 'warning.light'
                              : 'grey.300'
                            : 'transparent',
                          opacity: dayData.isCurrentMonth ? 1 : 0.3,
                          transition: 'all 0.2s',
                          '&:hover': hasSession && dayData.isCurrentMonth
                            ? {
                                transform: 'scale(1.05)',
                                boxShadow: 2,
                              }
                            : {},
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: dayData.isToday ? 'bold' : 'normal',
                            color: hasSession ? 'white' : 'text.primary',
                          }}
                        >
                          {dayData.date.getDate()}
                        </Typography>
                        {hasSession && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.65rem',
                              color: 'white',
                              mt: 0.5,
                            }}
                          >
                            {formatDuration(dayData.totalMinutes)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Leyenda */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: 'success.light',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">{'> 60 min'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: 'warning.light',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">30-60 min</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: 'grey.300',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">{'< 30 min'}</Typography>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Dialog de detalle del día */}
        <Dialog
          open={showDayDetail}
          onClose={handleCloseDetail}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedDay && (
              <>
                Sesiones del {selectedDay.date.getDate()} de{' '}
                {monthNames[selectedDay.date.getMonth()]}
                <Typography variant="body2" color="text.secondary">
                  Total: {formatDuration(selectedDay.totalMinutes)}
                </Typography>
              </>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedDay && selectedDay.sessions.length > 0 ? (
              <List>
                {selectedDay.sessions.map((session) => (
                  <ListItem
                    key={session.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={`Duración: ${formatDuration(session.durationMinutes)}`}
                      secondary={
                        <>
                          {session.exercises && session.exercises.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" component="span" fontWeight="bold">
                                Ejercicios:
                              </Typography>
                              {session.exercises.map((ex) => (
                                <Typography
                                  key={ex.id}
                                  variant="body2"
                                  component="div"
                                  sx={{ ml: 2 }}
                                >
                                  • {ex.exercise?.name || 'Ejercicio'} (
                                  {formatDuration(ex.durationMinutes)})
                                  {ex.exercise?.book?.instrument && (
                                    <Chip 
                                      label={getInstrumentName(ex.exercise.book.instrument)} 
                                      size="small" 
                                      color="secondary" 
                                      sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
                                    />
                                  )}
                                </Typography>
                              ))}
                            </Box>
                          )}
                          {session.notes && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" component="span" fontWeight="bold">
                                Notas:
                              </Typography>
                              <Typography variant="body2" component="div">
                                {session.notes}
                              </Typography>
                            </Box>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No hay sesiones para este día</Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PracticeCalendar;

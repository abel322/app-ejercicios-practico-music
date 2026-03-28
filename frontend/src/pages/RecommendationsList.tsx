import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  CalendarToday as ConsistencyIcon,
  LibraryMusic as VarietyIcon,
  NotificationsActive as ReminderIcon,
  Timer as DurationIcon,
  MusicNote as ExerciseIcon,
  EmojiEvents as GettingStartedIcon,
} from '@mui/icons-material';
import { recommendationService } from '../services/recommendationService';
import { useNotification } from '../contexts/NotificationContext';
import type { Recommendation, RecommendationType, RecommendationPriority } from '../types/recommendation.types';

interface RecommendationsListProps {
  instrument?: string;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ instrument }) => {
  const { showNotification } = useNotification();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

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
    loadRecommendations();
  }, [instrument]); // Recargar cuando cambie el instrumento

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendations();
      
      // Filtrar recomendaciones por instrumento si se especifica
      // Nota: Esto depende de cómo el backend maneje las recomendaciones por instrumento
      // Por ahora, mostramos todas las recomendaciones pero con contexto del instrumento
      setRecommendations(data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al cargar las recomendaciones',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: RecommendationType) => {
    switch (type) {
      case 'consistency':
        return <ConsistencyIcon />;
      case 'variety':
        return <VarietyIcon />;
      case 'reminder':
        return <ReminderIcon />;
      case 'duration':
        return <DurationIcon />;
      case 'exercise_suggestion':
        return <ExerciseIcon />;
      case 'getting_started':
        return <GettingStartedIcon />;
      default:
        return <ExerciseIcon />;
    }
  };

  const getColorForPriority = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'high':
        return 'error'; // rojo
      case 'medium':
        return 'warning'; // amarillo
      case 'low':
        return 'info'; // azul
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getTypeLabel = (type: RecommendationType) => {
    switch (type) {
      case 'consistency':
        return 'Consistencia';
      case 'variety':
        return 'Variedad';
      case 'reminder':
        return 'Recordatorio';
      case 'duration':
        return 'Duración';
      case 'exercise_suggestion':
        return 'Sugerencia de Ejercicio';
      case 'getting_started':
        return 'Comenzar';
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recomendaciones
          {instrument && (
            <Typography variant="h6" component="span" color="primary" sx={{ ml: 2 }}>
              - {getInstrumentName(instrument)}
            </Typography>
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Recomendaciones personalizadas para mejorar tu práctica{instrument ? ` de ${getInstrumentName(instrument)}` : ''}.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : recommendations.length === 0 ? (
          <Alert severity="info">
            ¡Excelente trabajo! No hay recomendaciones en este momento{instrument ? ` para ${getInstrumentName(instrument)}` : ''}. Sigue practicando de manera consistente.
          </Alert>
        ) : (
          <Card elevation={2}>
            <CardContent>
              <List>
                {recommendations.map((recommendation, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        py: 2,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: `${getColorForPriority(recommendation.priority)}.main`,
                          minWidth: 56,
                        }}
                      >
                        {getIconForType(recommendation.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {getTypeLabel(recommendation.type)}
                            </Typography>
                            <Chip
                              label={getPriorityLabel(recommendation.priority)}
                              size="small"
                              color={getColorForPriority(recommendation.priority)}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {recommendation.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default RecommendationsList;

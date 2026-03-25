import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import {
  CalendarToday as ConsistencyIcon,
  LibraryMusic as VarietyIcon,
  NotificationsActive as ReminderIcon,
  Timer as DurationIcon,
  MusicNote as ExerciseIcon,
  EmojiEvents as GettingStartedIcon,
  ArrowForward as ArrowForwardIcon,
  MusicNote,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';
import type { Recommendation, RecommendationType, RecommendationPriority } from '../types/recommendation.types';

const RecommendationsPreview: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendations();
      // Mostrar solo las 3 principales
      setRecommendations(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: RecommendationType) => {
    switch (type) {
      case 'consistency':
        return <ConsistencyIcon fontSize="small" />;
      case 'variety':
        return <VarietyIcon fontSize="small" />;
      case 'reminder':
        return <ReminderIcon fontSize="small" />;
      case 'duration':
        return <DurationIcon fontSize="small" />;
      case 'exercise_suggestion':
        return <ExerciseIcon fontSize="small" />;
      case 'getting_started':
        return <GettingStartedIcon fontSize="small" />;
      default:
        return <MusicNote fontSize="small" />;
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

  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recomendaciones
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null; // No mostrar la tarjeta si no hay recomendaciones
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recomendaciones
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/recommendations')}
          >
            Ver todas
          </Button>
        </Box>

        <List disablePadding>
          {recommendations.map((recommendation, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  px: 0,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: `${getColorForPriority(recommendation.priority)}.main`,
                    minWidth: 40,
                  }}
                >
                  {getIconForType(recommendation.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={getPriorityLabel(recommendation.priority)}
                        size="small"
                        color={getColorForPriority(recommendation.priority)}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
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
  );
};

export default RecommendationsPreview;

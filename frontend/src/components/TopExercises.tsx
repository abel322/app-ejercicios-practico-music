import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import type { TopExercise } from '../types/dashboard.types';

interface TopExercisesProps {
  exercises: TopExercise[];
  loading?: boolean;
}

const TopExercises: React.FC<TopExercisesProps> = ({ exercises, loading = false }) => {
  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 5 Ejercicios
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 5 Ejercicios
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No hay ejercicios para mostrar
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top 5 Ejercicios
        </Typography>
        <List>
          {exercises.map((exercise, index) => (
            <ListItem
              key={exercise.exerciseId}
              sx={{
                borderRadius: 1,
                mb: 1,
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  mr: 2,
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Box>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MusicNote fontSize="small" aria-hidden="true" />
                    <Typography variant="body1" fontWeight="medium">
                      {exercise.exerciseName}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {exercise.bookName}
                  </Typography>
                }
              />
              <Chip
                label={formatTime(exercise.totalMinutes)}
                color="primary"
                size="small"
                sx={{ fontWeight: 'bold' }}
                aria-label={`Tiempo total: ${formatTime(exercise.totalMinutes)}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TopExercises;

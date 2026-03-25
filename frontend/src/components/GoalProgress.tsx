import React from 'react';
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
  Chip,
} from '@mui/material';
import { Flag as FlagIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { GoalWithProgress } from '../types/goal.types';

interface GoalProgressProps {
  goal: GoalWithProgress;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const isCompleted = goal.progress >= 100;
  const progressPercentage = Math.min(goal.progress, 100);

  const getGoalTypeLabel = (type: string) => {
    return type === 'DAILY' ? 'Diaria' : 'Semanal';
  };

  const getProgressColor = () => {
    if (isCompleted) return 'success';
    if (goal.progress >= 75) return 'primary';
    if (goal.progress >= 50) return 'warning';
    return 'error';
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCompleted ? (
              <CheckCircleIcon color="success" />
            ) : (
              <FlagIcon color="primary" />
            )}
            <Typography variant="h6">
              Meta {getGoalTypeLabel(goal.type)}
            </Typography>
          </Box>
          <Chip
            label={getGoalTypeLabel(goal.type)}
            size="small"
            color={goal.type === 'DAILY' ? 'primary' : 'secondary'}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progreso
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {goal.currentMinutes} / {goal.targetMinutes} min
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            color={getProgressColor()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" color={isCompleted ? 'success.main' : 'text.primary'}>
            {progressPercentage.toFixed(0)}%
          </Typography>
          {isCompleted && (
            <Chip
              label="¡Completada!"
              color="success"
              size="small"
              icon={<CheckCircleIcon />}
            />
          )}
        </Box>

        {!isCompleted && goal.progress > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {goal.progress < 50
              ? '¡Sigue así! Cada minuto cuenta.'
              : goal.progress < 75
              ? '¡Vas por buen camino!'
              : '¡Casi lo logras!'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgress;

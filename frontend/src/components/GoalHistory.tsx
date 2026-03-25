import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { goalService } from '../services/goalService';
import { useNotification } from '../contexts/NotificationContext';
import type { Goal } from '../types/goal.types';

interface GoalHistoryProps {
  onEdit?: (goal: Goal) => void;
  onRefresh?: () => void;
}

const GoalHistory: React.FC<GoalHistoryProps> = ({ onEdit, onRefresh }) => {
  const { showNotification } = useNotification();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const loadGoals = async () => {
    try {
      setLoading(true);
      const activeFilter = filter === 'all' ? undefined : filter === 'active';
      const data = await goalService.getGoals(activeFilter);
      setGoals(data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al cargar las metas',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta meta?')) {
      return;
    }

    try {
      await goalService.deleteGoal(id);
      showNotification('Meta eliminada exitosamente', 'success');
      loadGoals();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al eliminar la meta',
        'error'
      );
    }
  };

  const handleToggleActive = async (goal: Goal) => {
    try {
      await goalService.updateGoal(goal.id, { active: !goal.active });
      showNotification(
        `Meta ${goal.active ? 'desactivada' : 'activada'} exitosamente`,
        'success'
      );
      loadGoals();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al actualizar la meta',
        'error'
      );
    }
  };

  const getGoalTypeLabel = (type: string) => {
    return type === 'DAILY' ? 'Diaria' : 'Semanal';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: 'all' | 'active' | 'inactive' | null
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Historial de Metas</Typography>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            size="small"
          >
            <ToggleButton value="all">Todas</ToggleButton>
            <ToggleButton value="active">Activas</ToggleButton>
            <ToggleButton value="inactive">Inactivas</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : goals.length === 0 ? (
          <Alert severity="info">
            No hay metas {filter === 'active' ? 'activas' : filter === 'inactive' ? 'inactivas' : ''} registradas.
          </Alert>
        ) : (
          <List>
            {goals.map((goal, index) => (
              <React.Fragment key={goal.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        edge="end"
                        onClick={() => handleToggleActive(goal)}
                        title={goal.active ? 'Desactivar' : 'Activar'}
                      >
                        {goal.active ? <CheckCircleIcon color="success" /> : <CancelIcon />}
                      </IconButton>
                      {onEdit && (
                        <IconButton
                          edge="end"
                          onClick={() => onEdit(goal)}
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(goal.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Meta {getGoalTypeLabel(goal.type)}
                        </Typography>
                        <Chip
                          label={goal.active ? 'Activa' : 'Inactiva'}
                          size="small"
                          color={goal.active ? 'success' : 'default'}
                        />
                        <Chip
                          label={getGoalTypeLabel(goal.type)}
                          size="small"
                          color={goal.type === 'DAILY' ? 'primary' : 'secondary'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Objetivo: {goal.targetMinutes} minutos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Inicio: {formatDate(goal.startDate)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalHistory;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Divider,
  Stack,
} from '@mui/material';
import { TrendingUp, EmojiEvents, ArrowForward } from '@mui/icons-material';
import { levelService } from '../services/levelService';
import type { LevelChange } from '../types/level.types';
import { Level } from '../types/auth.types';

interface LevelHistoryProps {
  instrument?: string;
}

const LevelHistory: React.FC<LevelHistoryProps> = ({ instrument }) => {
  const [history, setHistory] = useState<LevelChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await levelService.getLevelHistory(instrument);
        setHistory(data.history);
      } catch (err: any) {
        console.error('Error fetching level history:', err);
        setError(err.response?.data?.message || 'Error al cargar historial de niveles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [instrument]);

  const getLevelColor = (level: Level): 'primary' | 'success' | 'default' => {
    switch (level) {
      case 'BASIC':
        return 'default';
      case 'INTERMEDIATE':
        return 'primary';
      case 'ADVANCED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getLevelLabel = (level: Level): string => {
    switch (level) {
      case 'BASIC':
        return 'Básico';
      case 'INTERMEDIATE':
        return 'Intermedio';
      case 'ADVANCED':
        return 'Avanzado';
      default:
        return level;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (history.length === 0) {
    return (
      <Alert severity="info" icon={<EmojiEvents />}>
        <Typography variant="body1" fontWeight="bold">
          Aún no tienes cambios de nivel
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Continúa practicando para alcanzar nuevos niveles y verás tu progreso aquí.
        </Typography>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6">Historial de Niveles</Typography>
        </Box>

        <Stack spacing={2}>
          {history.map((change) => (
            <Card key={change.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <EmojiEvents sx={{ color: getLevelColor(change.newLevel) === 'primary' ? 'primary.main' : getLevelColor(change.newLevel) === 'success' ? 'success.main' : 'text.secondary' }} />
                  <Chip
                    label={getLevelLabel(change.previousLevel)}
                    size="small"
                    color={getLevelColor(change.previousLevel)}
                  />
                  <ArrowForward fontSize="small" color="action" />
                  <Chip
                    label={getLevelLabel(change.newLevel)}
                    size="small"
                    color={getLevelColor(change.newLevel)}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDate(change.achievedAt)}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Métricas al alcanzar este nivel:
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Horas totales
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {change.totalHours.toFixed(1)}h
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Consistencia
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {change.consistency.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Variedad
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {change.exerciseVariety}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LevelHistory;

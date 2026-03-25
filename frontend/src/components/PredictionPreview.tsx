import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { TrendingUp, ArrowForward, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import type { LevelPrediction } from '../types/prediction.types';

const PredictionPreview: React.FC = () => {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<LevelPrediction | null>(null);
  const [insufficientData, setInsufficientData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      const response = await predictionService.getNextLevelPrediction();
      setPrediction(response.prediction);
      setInsufficientData(response.insufficientData);
    } catch (err) {
      console.error('Error loading prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      BASIC: 'Básico',
      INTERMEDIATE: 'Intermedio',
      ADVANCED: 'Avanzado',
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (insufficientData) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6">Predicción de Progreso</Typography>
        </Box>
        <Alert severity="info">
          Necesitas al menos 7 días de datos de práctica para generar predicciones.
        </Alert>
      </Paper>
    );
  }

  if (!prediction) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6">Predicción de Progreso</Typography>
        </Box>
        <Alert severity="success">
          ¡Felicidades! Ya has alcanzado el nivel máximo (Avanzado).
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TrendingUp color="primary" />
        <Typography variant="h6">Predicción de Progreso</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Siguiente nivel objetivo:
        </Typography>
        <Chip
          label={getLevelLabel(prediction.nextLevel)}
          color="primary"
          sx={{ fontSize: '0.95rem', py: 2 }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Fecha estimada:
          </Typography>
        </Box>
        <Typography variant="body1" color="primary" fontWeight="medium">
          {formatDate(prediction.estimatedDate)}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Escenario conservador: {prediction.scenarios[0].estimatedDays} días
        </Typography>
      </Box>

      <Button
        variant="outlined"
        endIcon={<ArrowForward />}
        onClick={() => navigate('/predictions')}
        fullWidth
      >
        Ver todos los escenarios
      </Button>
    </Paper>
  );
};

export default PredictionPreview;

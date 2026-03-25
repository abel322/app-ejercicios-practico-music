import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { TrendingUp, CalendarToday, Timer } from '@mui/icons-material';
import { predictionService } from '../services/predictionService';
import type { LevelPrediction } from '../types/prediction.types';

interface PredictionDisplayProps {
  instrument?: string;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ instrument }) => {
  const [prediction, setPrediction] = useState<LevelPrediction | null>(null);
  const [insufficientData, setInsufficientData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrediction();
  }, [instrument]);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await predictionService.getNextLevelPrediction(instrument);
      setPrediction(response.prediction);
      setInsufficientData(response.insufficientData);
    } catch (err) {
      setError('Error al cargar las predicciones');
      console.error('Error loading prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInstrumentInfo = (instrument?: string) => {
    const instruments: Record<string, { name: string; color: string; icon: string }> = {
      PIANO: { name: 'Piano', color: '#6366F1', icon: '🎹' },
      GUITAR: { name: 'Guitarra', color: '#EC4899', icon: '🎸' },
      DRUMS: { name: 'Batería', color: '#F59E0B', icon: '🥁' },
      BASS: { name: 'Bajo', color: '#10B981', icon: '🎸' },
    };
    return instrument ? instruments[instrument] : null;
  };

  const instrumentInfo = getInstrumentInfo(instrument);

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
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (insufficientData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="primary" />
            {instrumentInfo ? `Predicciones - ${instrumentInfo.name}` : 'Predicciones'}
            {instrumentInfo && (
              <Chip
                label={instrumentInfo.name}
                sx={{
                  backgroundColor: instrumentInfo.color,
                  color: 'white',
                  fontWeight: 'bold',
                  ml: 1,
                }}
              />
            )}
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            {instrumentInfo 
              ? `Necesitas al menos 7 días de datos de práctica en ${instrumentInfo.name.toLowerCase()} para generar predicciones. Sigue practicando y vuelve pronto para ver tu progreso proyectado.`
              : 'Necesitas al menos 7 días de datos de práctica para generar predicciones. Sigue practicando y vuelve pronto para ver tu progreso proyectado.'
            }
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!prediction) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="primary" />
            {instrumentInfo ? `Predicciones - ${instrumentInfo.name}` : 'Predicciones'}
            {instrumentInfo && (
              <Chip
                label={instrumentInfo.name}
                sx={{
                  backgroundColor: instrumentInfo.color,
                  color: 'white',
                  fontWeight: 'bold',
                  ml: 1,
                }}
              />
            )}
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            {instrumentInfo 
              ? `¡Felicidades! Ya has alcanzado el nivel máximo (Avanzado) en ${instrumentInfo.name.toLowerCase()}.`
              : '¡Felicidades! Ya has alcanzado el nivel máximo (Avanzado).'
            }
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          {instrumentInfo ? `Predicciones - ${instrumentInfo.name}` : 'Predicciones'}
          {instrumentInfo && (
            <Chip
              label={instrumentInfo.name}
              sx={{
                backgroundColor: instrumentInfo.color,
                color: 'white',
                fontWeight: 'bold',
                ml: 1,
              }}
            />
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {instrumentInfo 
            ? `Proyección de cuándo alcanzarás el siguiente nivel en ${instrumentInfo.name.toLowerCase()} basado en tu práctica actual.`
            : 'Proyección de cuándo alcanzarás el siguiente nivel basado en tu práctica actual.'
          }
        </Typography>

        {/* Siguiente nivel objetivo */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TrendingUp color="primary" />
            <Typography variant="h6">Siguiente Nivel Objetivo</Typography>
          </Box>
          <Chip
            label={getLevelLabel(prediction.nextLevel)}
            color="primary"
            size="large"
            sx={{ fontSize: '1.1rem', py: 2.5, px: 1 }}
          />
        </Paper>

        {/* Fecha estimada */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CalendarToday color="primary" />
            <Typography variant="h6">Fecha Estimada</Typography>
          </Box>
          <Typography variant="h5" color="primary">
            {formatDate(prediction.estimatedDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Basado en tu ritmo actual de práctica
          </Typography>
        </Paper>

        {/* Escenarios de predicción */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Timer color="primary" />
            <Typography variant="h6">Escenarios de Práctica</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Diferentes proyecciones según tu dedicación diaria:
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Escenario</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Minutos Diarios</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Días Estimados</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prediction.scenarios.map((scenario, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor:
                        index === 0
                          ? 'action.hover'
                          : 'transparent',
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {scenario.name}
                    </TableCell>
                    <TableCell align="right">{scenario.dailyMinutes} min</TableCell>
                    <TableCell align="right">
                      <strong>{scenario.estimatedDays} días</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default PredictionDisplay;

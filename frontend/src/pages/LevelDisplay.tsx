import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { EmojiEvents, TrendingUp } from '@mui/icons-material';
import { levelService } from '../services/levelService';
import type { CurrentLevelResponse } from '../types/level.types';
import { Level } from '../types/auth.types';
import LevelHistory from '../components/LevelHistory';

interface LevelDisplayProps {
  instrument?: string;
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ instrument }) => {
  const [levelData, setLevelData] = useState<CurrentLevelResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await levelService.getCurrentLevel(instrument);
        setLevelData(data);
      } catch (err: any) {
        console.error('Error fetching level data:', err);
        setError(err.response?.data?.message || 'Error al cargar datos de nivel');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevelData();
  }, [instrument]);

  const getInstrumentInfo = (instrument?: string) => {
    const instruments: Record<string, { name: string; color: string; icon: string }> = {
      PIANO: { name: 'Piano', color: '#6366F1', icon: '🎹' },
      GUITAR: { name: 'Guitarra', color: '#EC4899', icon: '🎸' },
      DRUMS: { name: 'Batería', color: '#F59E0B', icon: '🥁' },
      BASS: { name: 'Bajo', color: '#10B981', icon: '🎸' },
    };
    return instrument ? instruments[instrument] : null;
  };

  const getLevelColor = (level: Level): string => {
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

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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

  if (!levelData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No se encontraron datos de nivel</Alert>
        </Box>
      </Container>
    );
  }

  const { level, progress } = levelData;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEvents color="primary" />
          {instrumentInfo ? `Tu Nivel - ${instrumentInfo.name}` : 'Tu Nivel'}
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
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          {instrumentInfo 
            ? `Progreso y métricas de tu nivel actual en ${instrumentInfo.name.toLowerCase()}`
            : 'Progreso y métricas de tu nivel actual'
          }
        </Typography>

        {/* Nivel Actual */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Nivel Actual</Typography>
              <Chip
                label={getLevelLabel(level)}
                color={getLevelColor(level) as any}
                size="medium"
                sx={{ fontSize: '1.1rem', fontWeight: 'bold', px: 2 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Progreso hacia siguiente nivel */}
        {progress.nextLevel && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6">
                  Progreso hacia {getLevelLabel(progress.nextLevel)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progreso general
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {progress.percentageToNext.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress.percentageToNext, 100)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Métricas actuales */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Métricas Actuales
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Horas totales
                    </Typography>
                    <Typography variant="h6">{progress.totalHours.toFixed(1)}h</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Consistencia
                    </Typography>
                    <Typography variant="h6">{progress.consistency.toFixed(1)}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Variedad de ejercicios
                    </Typography>
                    <Typography variant="h6">{progress.exerciseVariety}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Requisitos faltantes */}
              {progress.missingRequirements.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Para alcanzar el siguiente nivel necesitas:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    {progress.missingRequirements.map((requirement, index) => (
                      <Typography component="li" key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {requirement}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mensaje cuando ya está en nivel máximo */}
        {!progress.nextLevel && (
          <Card>
            <CardContent>
              <Alert severity="success" icon={<EmojiEvents />}>
                <Typography variant="body1" fontWeight="bold">
                  ¡Felicitaciones! Has alcanzado el nivel máximo
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Continúa practicando para mantener tu excelencia musical.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Historial de niveles */}
        <Box sx={{ mt: 4 }}>
          <LevelHistory instrument={instrument} />
        </Box>
      </Box>
    </Container>
  );
};

export default LevelDisplay;

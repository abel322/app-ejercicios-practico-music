import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  Stack,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow,
  Album,
  MusicNote,
  Speed,
  Timeline,
  GraphicEq,
  Audiotrack,
} from '@mui/icons-material';

interface Lesson {
  id: string;
  title: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  content: React.ReactNode;
}

const DrumLessons: React.FC = () => {
  const theme = useTheme();
  const [expandedLesson, setExpandedLesson] = useState<string | false>(false);

  const handleLessonChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedLesson(isExpanded ? panel : false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico':
        return {
          bg: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
          border: theme.palette.success.main,
        };
      case 'Intermedio':
        return {
          bg: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          border: theme.palette.warning.main,
        };
      case 'Avanzado':
        return {
          bg: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
          border: theme.palette.error.main,
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[500],
          border: theme.palette.grey[500],
        };
    }
  };

  const drumLessons: Lesson[] = [
    {
      id: 'drums-basic-1',
      title: 'Anatomía del Pentagrama de Batería',
      level: 'Básico',
      description: 'Domina la lectura del sistema de notación percusiva estándar',
      content: (
        <Box>
          <Stack spacing={4}>
            {/* Introducción moderna */}
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                p: 3,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <GraphicEq sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    El Sistema de Notación Percusiva
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    La batería utiliza un pentagrama no tonal donde cada línea y espacio representa un elemento específico del kit. A diferencia de instrumentos melódicos, aquí la altura vertical indica qué tambor o platillo tocar, no la altura tonal.
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Mapa del pentagrama */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: `linear-gradient(to right, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.main, 0.02)})`,
                border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3} color="info.main">
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mapa Vertical del Kit
              </Typography>
              
              <Box
                sx={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '1.1rem',
                  lineHeight: 2.5,
                  backgroundColor: 'white',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e0e0e0', pb: 1 }}>
                    <Typography component="span" fontWeight="bold">Posición</Typography>
                    <Typography component="span" fontWeight="bold">Elemento</Typography>
                    <Typography component="span" fontWeight="bold">Símbolo</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">5ª línea _____</Typography>
                    <Typography component="span">Crash Cymbal</Typography>
                    <Typography component="span" fontSize="1.5rem">○</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">4º espacio</Typography>
                    <Typography component="span">Hi-Hat Abierto</Typography>
                    <Typography component="span" fontSize="1.5rem">○</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">4ª línea _____</Typography>
                    <Typography component="span">Hi-Hat Cerrado</Typography>
                    <Typography component="span" fontSize="1.5rem">×</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">3º espacio</Typography>
                    <Typography component="span">Tom Agudo (High Tom)</Typography>
                    <Typography component="span" fontSize="1.5rem">♩</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, bgcolor: alpha(theme.palette.warning.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.15) } }}>
                    <Typography component="span" fontWeight="bold">3ª línea _____</Typography>
                    <Typography component="span" fontWeight="bold">Caja (Snare Drum)</Typography>
                    <Typography component="span" fontSize="1.5rem">♩</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">2º espacio</Typography>
                    <Typography component="span">Tom Medio (Mid Tom)</Typography>
                    <Typography component="span" fontSize="1.5rem">♩</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">2ª línea _____</Typography>
                    <Typography component="span">Tom Grave (Floor Tom)</Typography>
                    <Typography component="span" fontSize="1.5rem">♩</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) } }}>
                    <Typography component="span" fontWeight="bold">1º espacio</Typography>
                    <Typography component="span" fontWeight="bold">Bombo (Bass Drum)</Typography>
                    <Typography component="span" fontSize="1.5rem">♩</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    <Typography component="span">Debajo _____</Typography>
                    <Typography component="span">Pedal Hi-Hat</Typography>
                    <Typography component="span" fontSize="1.5rem">+</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box mt={3} p={2} bgcolor={alpha(theme.palette.info.main, 0.05)} borderRadius={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>💡 Tip Pro:</strong> La caja (3ª línea) y el bombo (1º espacio) son los elementos rítmicos fundamentales. Identifícalos primero al leer cualquier partitura.
                </Typography>
              </Box>
            </Paper>

            {/* Símbolos y notación */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, white 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={2} color="success.main">
                    <Audiotrack sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Formas de Cabeza de Nota
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography sx={{ fontSize: '2rem', minWidth: 40, textAlign: 'center' }}>♩</Typography>
                      <Box>
                        <Typography fontWeight="bold">Nota Estándar</Typography>
                        <Typography variant="body2" color="text.secondary">Caja, toms, bombo</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography sx={{ fontSize: '2rem', minWidth: 40, textAlign: 'center' }}>×</Typography>
                      <Box>
                        <Typography fontWeight="bold">Cruz (X)</Typography>
                        <Typography variant="body2" color="text.secondary">Hi-hat cerrado, ride cymbal</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography sx={{ fontSize: '2rem', minWidth: 40, textAlign: 'center' }}>○</Typography>
                      <Box>
                        <Typography fontWeight="bold">Círculo Abierto</Typography>
                        <Typography variant="body2" color="text.secondary">Hi-hat abierto, crash, splash</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography sx={{ fontSize: '2rem', minWidth: 40, textAlign: 'center' }}>◊</Typography>
                      <Box>
                        <Typography fontWeight="bold">Diamante</Typography>
                        <Typography variant="body2" color="text.secondary">Bombo (notación alternativa)</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, white 100%)`,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={2} color="secondary.main">
                    <MusicNote sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Articulaciones y Técnicas
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold" mb={0.5}>Sticking (Manos)</Typography>
                      <Typography variant="body2" color="text.secondary">R = Right (derecha) | L = Left (izquierda)</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold" mb={0.5}>Acentos</Typography>
                      <Typography variant="body2" color="text.secondary">&gt; = Acento (golpe más fuerte)</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold" mb={0.5}>Ghost Notes</Typography>
                      <Typography variant="body2" color="text.secondary">( ) = Nota fantasma (muy suave)</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold" mb={0.5}>Redobles</Typography>
                      <Typography variant="body2" color="text.secondary">~~~ = Roll (redoble continuo)</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold" mb={0.5}>Flam</Typography>
                      <Typography variant="body2" color="text.secondary">♪♩ = Grace note + nota principal</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            {/* Ejemplo práctico */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: `linear-gradient(to bottom, ${alpha(theme.palette.warning.main, 0.05)}, white)`,
                border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3} color="warning.main">
                <Speed sx={{ mr: 1, verticalAlign: 'middle' }} />
                Ejemplo: Patrón Básico de Rock
              </Typography>
              
              <Box
                sx={{
                  textAlign: 'center',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '1.3rem',
                  backgroundColor: '#1a1a1a',
                  color: '#00ff00',
                  p: 4,
                  borderRadius: 2,
                  lineHeight: 2,
                  boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <Box component="pre" sx={{ m: 0 }}>
{`Hi-Hat:  × × × × × × × ×
         ─────────────────
Caja:    |   ♩   |   ♩   |
         ─────────────────
Bombo:   ♩   |   ♩   |   |
         ─────────────────
Tiempo:  1 e + a 2 e + a`}
                </Box>
              </Box>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={4}>
                  <Box p={2} bgcolor={alpha(theme.palette.info.main, 0.1)} borderRadius={1}>
                    <Typography variant="subtitle2" fontWeight="bold" color="info.main">
                      Hi-Hat (×)
                    </Typography>
                    <Typography variant="body2">
                      8 corcheas constantes (pulso continuo)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box p={2} bgcolor={alpha(theme.palette.warning.main, 0.1)} borderRadius={1}>
                    <Typography variant="subtitle2" fontWeight="bold" color="warning.main">
                      Caja (♩)
                    </Typography>
                    <Typography variant="body2">
                      Backbeat en tiempos 2 y 4
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box p={2} bgcolor={alpha(theme.palette.error.main, 0.1)} borderRadius={1}>
                    <Typography variant="subtitle2" fontWeight="bold" color="error.main">
                      Bombo (♩)
                    </Typography>
                    <Typography variant="body2">
                      Tiempos 1 y 3 (downbeats)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Box>
      ),
    },
    {
      id: 'drums-basic-2',
      title: 'Subdivisiones Rítmicas y Compases',
      level: 'Básico',
      description: 'Domina las subdivisiones del tiempo y la estructura de compases',
      content: (
        <Box>
          <Stack spacing={4}>
            {/* Teoría de subdivisiones */}
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                p: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                La Pirámide de Subdivisiones
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Cada nivel de subdivisión divide el tiempo en partes más pequeñas, permitiendo mayor precisión rítmica y complejidad en tus grooves.
              </Typography>
            </Card>

            {/* Subdivisiones visuales */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.success.main, 0.1)}, white)`,
                    border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  }}
                >
                  <Chip label="Nivel 1" color="success" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Negras (Quarter Notes)
                  </Typography>
                  <Box
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                      bgcolor: '#1a1a1a',
                      color: '#4CAF50',
                      p: 3,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <div>♩ ♩ ♩ ♩</div>
                    <div style={{ fontSize: '1rem', marginTop: '8px' }}>1 2 3 4</div>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    1 golpe por tiempo. Base fundamental del groove.
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    BPM recomendado: 60-120
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.warning.main, 0.1)}, white)`,
                    border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  }}
                >
                  <Chip label="Nivel 2" color="warning" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Corcheas (Eighth Notes)
                  </Typography>
                  <Box
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                      bgcolor: '#1a1a1a',
                      color: '#FF9800',
                      p: 3,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <div>♫ ♫ ♫ ♫</div>
                    <div style={{ fontSize: '1rem', marginTop: '8px' }}>1 + 2 + 3 + 4 +</div>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    2 golpes por tiempo. Estándar en rock y pop.
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    BPM recomendado: 80-160
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.error.main, 0.1)}, white)`,
                    border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  }}
                >
                  <Chip label="Nivel 3" color="error" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Semicorcheas (16th Notes)
                  </Typography>
                  <Box
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '1.3rem',
                      textAlign: 'center',
                      bgcolor: '#1a1a1a',
                      color: '#F44336',
                      p: 3,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <div>♬♬♬♬</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>1e+a2e+a3e+a4e+a</div>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    4 golpes por tiempo. Fills y grooves complejos.
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    BPM recomendado: 60-140
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Patrones de groove */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>
                <Album sx={{ mr: 1, verticalAlign: 'middle' }} />
                Grooves Fundamentales en 4/4
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2} color="success.main">
                      Rock Básico (Straight Feel)
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        bgcolor: '#1a1a1a',
                        color: '#00ff00',
                        p: 2,
                        borderRadius: 1,
                        lineHeight: 1.8,
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`HH:  × × × × × × × ×
     ─────────────────
SD:  |   ♩   |   ♩   |
     ─────────────────
BD:  ♩   |   ♩   |   |
     ─────────────────
     1 e + a 2 e + a`}
                      </pre>
                    </Box>
                    <Typography variant="body2" mt={2} color="text.secondary">
                      Backbeat clásico. Caja en 2 y 4, bombo en 1 y 3.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2} color="info.main">
                      Shuffle/Swing (Triplet Feel)
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        bgcolor: '#1a1a1a',
                        color: '#00bfff',
                        p: 2,
                        borderRadius: 1,
                        lineHeight: 1.8,
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`HH:  ×  ×  ×  ×  ×  ×
     ─────────────────
SD:  |     ♩     ♩   |
     ─────────────────
BD:  ♩     |  ♩  |   |
     ─────────────────
     1  +  a  2  +  a`}
                      </pre>
                    </Box>
                    <Typography variant="body2" mt={2} color="text.secondary">
                      Swing de tresillo. Hi-hat en corcheas de tresillo.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2} color="warning.main">
                      Funk (16th Note Groove)
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        bgcolor: '#1a1a1a',
                        color: '#ffa500',
                        p: 2,
                        borderRadius: 1,
                        lineHeight: 1.8,
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`HH:  × × × × × × × × × × × × × × × ×
     ─────────────────────────────────
SD:  |   |   ♩   | (♩) | ♩ |   |   |
     ─────────────────────────────────
BD:  ♩   |   | ♩ |   |   | ♩ |   | ♩
     ─────────────────────────────────
     1 e + a 2 e + a 3 e + a 4 e + a`}
                      </pre>
                    </Box>
                    <Typography variant="body2" mt={2} color="text.secondary">
                      Ghost notes (♩) en caja. Bombo sincopado.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2} color="secondary.main">
                      Half-Time Feel
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        bgcolor: '#1a1a1a',
                        color: '#ff00ff',
                        p: 2,
                        borderRadius: 1,
                        lineHeight: 1.8,
                      }}
                    >
                      <pre style={{ margin: 0 }}>
{`HH:  × × × × × × × ×
     ─────────────────
SD:  |   |   ♩   |   |
     ─────────────────
BD:  ♩   |   |   |   |
     ─────────────────
     1 e + a 2 e + a`}
                      </pre>
                    </Box>
                    <Typography variant="body2" mt={2} color="text.secondary">
                      Caja solo en 3. Sensación de tempo reducido.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Dinámicas */}
            <Card
              sx={{
                p: 3,
                background: `linear-gradient(to right, ${alpha(theme.palette.error.main, 0.05)}, ${alpha(theme.palette.warning.main, 0.05)})`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Control Dinámico: La Clave del Groove
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Escala de Dinámicas:
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { symbol: 'pp', name: 'Pianissimo', desc: 'Muy suave', level: 1 },
                      { symbol: 'p', name: 'Piano', desc: 'Suave', level: 2 },
                      { symbol: 'mp', name: 'Mezzo-piano', desc: 'Medio suave', level: 3 },
                      { symbol: 'mf', name: 'Mezzo-forte', desc: 'Medio fuerte', level: 4 },
                      { symbol: 'f', name: 'Forte', desc: 'Fuerte', level: 5 },
                      { symbol: 'ff', name: 'Fortissimo', desc: 'Muy fuerte', level: 6 },
                    ].map((dynamic) => (
                      <Box
                        key={dynamic.symbol}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1,
                          bgcolor: alpha(theme.palette.warning.main, dynamic.level * 0.05),
                          borderRadius: 1,
                        }}
                      >
                        <Typography fontWeight="bold" sx={{ minWidth: 40 }}>
                          {dynamic.symbol}
                        </Typography>
                        <Typography variant="body2">
                          {dynamic.name} - {dynamic.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Articulaciones Avanzadas:
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold">&gt; Acento</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Golpe significativamente más fuerte que las notas circundantes
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold">( ) Ghost Note</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nota casi inaudible, esencial en funk y R&B
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold">• Staccato</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Golpe corto y seco, sin resonancia
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                      <Typography fontWeight="bold">— Tenuto</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mantener el valor completo de la nota
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </Box>
      ),
    },
    {
      id: 'drums-intermediate-1',
      title: 'Fills y Notación Avanzada',
      level: 'Intermedio',
      description: 'Aprende a leer y escribir fills complejos en partitura',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Fills de 1 Compás</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" gutterBottom>
              Los fills rompen el patrón regular y conectan secciones musicales:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Fill descendente en toms
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.6 }}>
                    <div>Tom A: ♩   |   |   |   |</div>
                    <div>Tom M: |   ♩   |   |   |</div>
                    <div>Tom G: |   |   ♩   |   |</div>
                    <div>Caja:  |   |   |   ♩   |</div>
                    <div>Bombo: |   |   |   |   ♩</div>
                    <div>Tiempo:1   2   3   4   1</div>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Fill con semicorcheas
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.6 }}>
                    <div>Caja:  ♬ ♬ ♬ ♬ ♬ ♬ ♬ ♬</div>
                    <div>Bombo: |   |   |   |   ♩</div>
                    <div>Tiempo:1 e + a 2 e + a 1</div>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    R L R L R L R L (alternancia de manos)
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Notación de Rudimentos</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              Técnicas fundamentales de batería escritas en partitura:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Paradiddle (R-L-R-R):
                </Typography>
                <Box sx={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                  <div>♬ ♬ ♬ ♬</div>
                  <div>R L R R</div>
                  <div>1 e + a</div>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Flam (grace note + nota):
                </Typography>
                <Box sx={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                  <div>♪♩ ♪♩</div>
                  <div>LR LR</div>
                  <div>1  2</div>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Lecciones de Batería
      </Typography>
      
      {drumLessons.map((lesson) => (
        <Accordion
          key={lesson.id}
          expanded={expandedLesson === lesson.id}
          onChange={handleLessonChange(lesson.id)}
          sx={{ mb: 2, boxShadow: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: 'grey.50',
              '&:hover': { backgroundColor: 'grey.100' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Chip
                label={lesson.level}
                size="small"
                sx={{
                  backgroundColor: getLevelColor(lesson.level),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {lesson.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lesson.description}
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<PlayArrow />}
                sx={{ minWidth: 'auto' }}
              >
                Estudiar
              </Button>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {lesson.content}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DrumLessons;
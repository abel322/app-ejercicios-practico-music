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
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, PlayArrow, GraphicEq, MusicNote } from '@mui/icons-material';

interface Lesson {
  id: string;
  title: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  content: React.ReactNode;
}

const BassLessons: React.FC = () => {
  const [expandedLesson, setExpandedLesson] = useState<string | false>(false);

  const handleLessonChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedLesson(isExpanded ? panel : false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico': return '#4CAF50';
      case 'Intermedio': return '#FF9800';
      case 'Avanzado': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const bassLessons: Lesson[] = [
    {
      id: 'bass-basic-1',
      title: 'Clave de Fa y Registro del Bajo',
      level: 'Básico',
      description: 'Aprende a leer en clave de fa y el registro específico del bajo',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            La Clave de Fa
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f8ff' }}>
            <Typography variant="body1" gutterBottom>
              El bajo se escribe principalmente en clave de fa, que indica las notas graves:
            </Typography>
            <Box sx={{ textAlign: 'center', my: 3, fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Líneas del pentagrama (de abajo hacia arriba):</Typography>
              <div>5ª línea: _____ LA</div>
              <div>4º espacio: SOL</div>
              <div>4ª línea: _____ FA</div>
              <div>3º espacio: MI</div>
              <div>3ª línea: _____ RE</div>
              <div>2º espacio: DO</div>
              <div>2ª línea: _____ SI</div>
              <div>1º espacio: LA</div>
              <div>1ª línea: _____ SOL</div>
            </Box>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                💡 Truco: "Sol Si Re Fa La" (líneas) y "La Do Mi Sol" (espacios)
              </Typography>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Cuerdas del Bajo en Partitura
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fff8' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Afinación estándar (4 cuerdas):
                </Typography>
                <Stack spacing={0.5}>
                  <Typography>• 4ª cuerda (más grave): MI (E1)</Typography>
                  <Typography>• 3ª cuerda: LA (A1)</Typography>
                  <Typography>• 2ª cuerda: RE (D2)</Typography>
                  <Typography>• 1ª cuerda (más aguda): SOL (G2)</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  En el pentagrama:
                </Typography>
                <Typography variant="body2">
                  Las cuerdas al aire se escriben desde el MI grave hasta el SOL (primera línea del pentagrama).
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'bass-basic-2',
      title: 'Líneas de Bajo en Partitura',
      level: 'Básico',
      description: 'Aprende a leer y escribir líneas de bajo fundamentales',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Progresiones Básicas</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              Cómo se escriben las progresiones de acordes más comunes:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    I-V-vi-IV (Do Mayor)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Acordes:</strong> C - G - Am - F
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Bajo:</strong> DO - SOL - LA - FA
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    ii-V-I (Jazz básico)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Acordes:</strong> Dm - G7 - C
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Bajo:</strong> RE - SOL - DO
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Patrones Rítmicos</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fafafa' }}>
            <Typography variant="body1" gutterBottom>
              Diferentes formas de tocar las mismas notas con distintos ritmos:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#ffebee' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Redondas (4 tiempos)
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Una nota por compás
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#f3e5f5' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Blancas (2 tiempos)
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Dos notas por compás
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#e8eaf6' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Walking Bass
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Cuatro notas por compás
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'bass-intermediate-1',
      title: 'Técnicas Avanzadas en Partitura',
      level: 'Intermedio',
      description: 'Aprende a leer técnicas como slap, pop y ghost notes',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Notación de Técnicas Especiales</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" gutterBottom>
              Símbolos especiales para técnicas de bajo moderno:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Slap y Pop:
                </Typography>
                <Typography variant="body2">• T = Thumb (slap con pulgar)</Typography>
                <Typography variant="body2">• P = Pop (tirar cuerda)</Typography>
                <Typography variant="body2">• S = Slap (alternativa a T)</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Ghost Notes:
                </Typography>
                <Typography variant="body2">• Nota fantasma (muy suave)</Typography>
                <Typography variant="body2">• x = Nota muerta</Typography>
                <Typography variant="body2">• Crea groove y ritmo</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Articulaciones y Dinámicas</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              Símbolos que modifican cómo se toca cada nota:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Articulaciones:
                </Typography>
                <Typography variant="body2">• Staccato = Nota corta y seca</Typography>
                <Typography variant="body2">• Tenuto = Nota sostenida</Typography>
                <Typography variant="body2">• Acento = Nota más fuerte</Typography>
                <Typography variant="body2">• Legato = Notas conectadas</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Efectos especiales:
                </Typography>
                <Typography variant="body2">• Bend = Estirar cuerda</Typography>
                <Typography variant="body2">• Slide = Deslizar entre trastes</Typography>
                <Typography variant="body2">• Hammer-on = Martilleo</Typography>
                <Typography variant="body2">• Pull-off = Tirón</Typography>
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
        Lecciones de Bajo
      </Typography>
      
      {bassLessons.map((lesson) => (
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

export default BassLessons;
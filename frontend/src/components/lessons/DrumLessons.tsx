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
import { ExpandMore as ExpandMoreIcon, PlayArrow, Album, MusicNote } from '@mui/icons-material';

interface Lesson {
  id: string;
  title: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  content: React.ReactNode;
}

const DrumLessons: React.FC = () => {
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

  const drumLessons: Lesson[] = [
    {
      id: 'drums-basic-1',
      title: 'Notación de Batería',
      level: 'Básico',
      description: 'Aprende cómo se escriben los diferentes elementos de la batería',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            El Pentagrama de Batería
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f8ff' }}>
            <Typography variant="body1" gutterBottom>
              La batería usa un pentagrama especial donde cada línea y espacio representa un elemento diferente:
            </Typography>
            <Box sx={{ textAlign: 'center', my: 3, fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: 2 }}>
              <div>5ª línea: _____ Crash Cymbal (platillo crash)</div>
              <div>4º espacio: Hi-Hat abierto</div>
              <div>4ª línea: _____ Hi-Hat cerrado</div>
              <div>3º espacio: Tom agudo</div>
              <div>3ª línea: _____ Caja (Snare)</div>
              <div>2º espacio: Tom medio</div>
              <div>2ª línea: _____ Tom grave</div>
              <div>1º espacio: Bombo (Kick)</div>
              <div>Debajo: _____ Pedal de Hi-Hat</div>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Símbolos y Formas de Notas
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fff8' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Formas de las notas:
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>♩</Typography>
                    <Typography>Nota normal (caja, toms)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>×</Typography>
                    <Typography>Hi-hat cerrado, ride</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>○</Typography>
                    <Typography>Hi-hat abierto, crash</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>◊</Typography>
                    <Typography>Bombo (kick drum)</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Técnicas especiales:
                </Typography>
                <Stack spacing={1}>
                  <Typography>• R = Mano derecha (Right)</Typography>
                  <Typography>• L = Mano izquierda (Left)</Typography>
                  <Typography>• f = Forte (fuerte)</Typography>
                  <Typography>• p = Piano (suave)</Typography>
                  <Typography>• Acento = golpe más fuerte</Typography>
                  <Typography>• ~ = Redoble</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Lectura de Patrones Básicos
          </Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fff8e1' }}>
            <Typography variant="body1" gutterBottom>
              Ejemplo de patrón básico de rock en notación:
            </Typography>
            <Box sx={{ textAlign: 'center', my: 3, fontFamily: 'monospace', fontSize: '1.2rem', backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
              <div>Hi-Hat: × × × × × × × ×</div>
              <div>Caja:   |   ♩   |   ♩   |</div>
              <div>Bombo:  ♩   |   ♩   |   |</div>
              <div>Tiempo: 1 e + a 2 e + a</div>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Lee de arriba hacia abajo: todos los elementos suenan simultáneamente
            </Typography>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'drums-basic-2',
      title: 'Ritmos y Compases',
      level: 'Básico',
      description: 'Aprende los patrones rítmicos fundamentales y su notación',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Compás de 4/4 en Batería</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              El compás más común en rock, pop y muchos otros estilos:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Patrón básico de rock
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.6 }}>
                    <div>Hi-Hat: × × × × × × × ×</div>
                    <div>Caja:   |   ♩   |   ♩   |</div>
                    <div>Bombo:  ♩   |   ♩   |   |</div>
                    <div>Tiempo: 1 e + a 2 e + a</div>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Bombo en 1 y 3, caja en 2 y 4
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Variación con bombo doble
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.6 }}>
                    <div>Hi-Hat: × × × × × × × ×</div>
                    <div>Caja:   |   ♩   |   ♩   |</div>
                    <div>Bombo:  ♩   | ♩ ♩   |   |</div>
                    <div>Tiempo: 1 e + a 2 e + a</div>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Bombo extra en el "y" del 2
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Subdivisiones del Tiempo</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fafafa' }}>
            <Typography variant="body1" gutterBottom>
              Cómo dividir cada tiempo en partes más pequeñas:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Negras (1 por tiempo):
                </Typography>
                <Box sx={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                  <div>♩ ♩ ♩ ♩</div>
                  <div>1 2 3 4</div>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Corcheas (2 por tiempo):
                </Typography>
                <Box sx={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                  <div>♫ ♫ ♫ ♫</div>
                  <div>1 + 2 + 3 + 4 +</div>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Semicorcheas (4 por tiempo):
                </Typography>
                <Box sx={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                  <div>♬♬♬♬</div>
                  <div>1e+a2e+a3e+a4e+a</div>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Dinámicas en Partitura</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fff8e1' }}>
            <Typography variant="body1" gutterBottom>
              Símbolos que indican la intensidad del sonido:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Niveles de volumen:
                </Typography>
                <Typography variant="body2">• pp = pianissimo (muy suave)</Typography>
                <Typography variant="body2">• p = piano (suave)</Typography>
                <Typography variant="body2">• mp = mezzo-piano (medio suave)</Typography>
                <Typography variant="body2">• mf = mezzo-forte (medio fuerte)</Typography>
                <Typography variant="body2">• f = forte (fuerte)</Typography>
                <Typography variant="body2">• ff = fortissimo (muy fuerte)</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Acentos y articulaciones:
                </Typography>
                <Typography variant="body2">• Acento = golpe más fuerte</Typography>
                <Typography variant="body2">• Staccato = golpe seco y corto</Typography>
                <Typography variant="body2">• Tenuto = mantener el sonido</Typography>
                <Typography variant="body2">• Ghost note = golpe muy suave</Typography>
              </Grid>
            </Grid>
          </Paper>
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
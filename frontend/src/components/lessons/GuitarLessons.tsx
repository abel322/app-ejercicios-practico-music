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

const GuitarLessons: React.FC = () => {
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

  const guitarLessons: Lesson[] = [
    {
      id: 'guitar-basic-1',
      title: 'Tablatura vs Partitura',
      level: 'Básico',
      description: 'Comprende las diferencias entre tablatura y notación musical estándar',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Tablatura de Guitarra
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f8ff' }}>
            <Typography variant="body1" gutterBottom>
              La tablatura muestra exactamente dónde poner los dedos en el mástil:
            </Typography>
            <Box sx={{ textAlign: 'center', my: 3, fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: 1.8 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Cuerdas (de aguda a grave):</Typography>
              <div>e |--0--2--3--5--| (1ª cuerda - Mi agudo)</div>
              <div>B |--1--3--5--7--| (2ª cuerda - Si)</div>
              <div>G |--0--2--4--6--| (3ª cuerda - Sol)</div>
              <div>D |--2--4--5--7--| (4ª cuerda - Re)</div>
              <div>A |--0--2--3--5--| (5ª cuerda - La)</div>
              <div>E |--3--5--7--8--| (6ª cuerda - Mi grave)</div>
            </Box>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                💡 Los números indican el traste: 0 = cuerda al aire, 3 = tercer traste
              </Typography>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Partitura Estándar
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fff8' }}>
            <Typography variant="body1" gutterBottom>
              La guitarra se escribe en clave de sol, pero suena una octava más grave:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Cuerdas al aire (de grave a agudo):
                </Typography>
                <Stack spacing={0.5}>
                  <Typography>• 6ª cuerda: MI (E2)</Typography>
                  <Typography>• 5ª cuerda: LA (A2)</Typography>
                  <Typography>• 4ª cuerda: RE (D3)</Typography>
                  <Typography>• 3ª cuerda: SOL (G3)</Typography>
                  <Typography>• 2ª cuerda: SI (B3)</Typography>
                  <Typography>• 1ª cuerda: MI (E4)</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Posición en el pentagrama:
                </Typography>
                <Typography variant="body2">
                  Las cuerdas al aire se escriben desde el MI bajo (debajo del pentagrama con líneas adicionales) 
                  hasta el MI agudo (primer espacio).
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Ventajas de cada sistema
          </Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fff8e1' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Tablatura
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>✅ Fácil de leer</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>✅ Muestra posición exacta</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>✅ Específica para guitarra</Typography>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>❌ No muestra ritmo claramente</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Partitura
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>✅ Muestra ritmo preciso</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>✅ Universal para todos los instrumentos</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>✅ Teoría musical completa</Typography>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>❌ Requiere más estudio</Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'guitar-basic-2',
      title: 'Acordes Abiertos en Partitura',
      level: 'Básico',
      description: 'Aprende cómo se escriben los acordes básicos en partitura y tablatura',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Acordes Mayores en Partitura</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    DO Mayor (C)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>En partitura:</strong> DO-MI-SOL-DO-MI
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.4, backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                    <div>e |--0--| (Mi)</div>
                    <div>B |--1--| (Do)</div>
                    <div>G |--0--| (Sol)</div>
                    <div>D |--2--| (Mi)</div>
                    <div>A |--3--| (Do)</div>
                    <div>E |--X--| (no tocar)</div>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    SOL Mayor (G)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>En partitura:</strong> SOL-SI-RE-SOL-SI-SOL
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.4, backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                    <div>e |--3--| (Sol)</div>
                    <div>B |--0--| (Si)</div>
                    <div>G |--0--| (Sol)</div>
                    <div>D |--0--| (Re)</div>
                    <div>A |--2--| (Si)</div>
                    <div>E |--3--| (Sol)</div>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    RE Mayor (D)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>En partitura:</strong> RE-LA-RE-FA#
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.4, backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                    <div>e |--2--| (Fa#)</div>
                    <div>B |--3--| (Re)</div>
                    <div>G |--2--| (La)</div>
                    <div>D |--0--| (Re)</div>
                    <div>A |--X--| (no tocar)</div>
                    <div>E |--X--| (no tocar)</div>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Lectura de Ritmo en Partitura</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fafafa' }}>
            <Typography variant="body1" gutterBottom>
              Combinar partitura y tablatura para ritmo y posición:
            </Typography>
            <Box sx={{ textAlign: 'center', my: 3, fontFamily: 'monospace', fontSize: '1rem', backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
              <div>Partitura: ♩ ♩ ♫ ♫ ♩ (ritmo)</div>
              <div>Tablatura: 0 3 2-0 2-0 3 (posición)</div>
              <div>Tiempo:   1 2 3-e 4-e 1</div>
            </Box>
            <Typography variant="body2" color="text.secondary">
              La partitura indica CUÁNDO tocar, la tablatura indica DÓNDE tocar
            </Typography>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'guitar-intermediate-1',
      title: 'Escalas en Partitura y Tablatura',
      level: 'Intermedio',
      description: 'Aprende a leer escalas combinando ambos sistemas de notación',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Escala de DO Mayor</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" gutterBottom>
              La escala más básica, sin alteraciones (sostenidos o bemoles):
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  En partitura (notas):
                </Typography>
                <Typography>DO - RE - MI - FA - SOL - LA - SI - DO</Typography>
                <Typography variant="body2" color="text.secondary">
                  Todas las notas naturales, sin alteraciones
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  En tablatura (posición abierta):
                </Typography>
                <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                  <div>e |--0--1--3--|</div>
                  <div>B |--1--3-----|</div>
                  <div>G |--0--2-----|</div>
                  <div>D |--0--2--3--|</div>
                  <div>A |--0--2--3--|</div>
                  <div>E |--0--1--3--|</div>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Alteraciones en Partitura</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              Símbolos que modifican las notas:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Sostenido (#)
                  </Typography>
                  <Typography variant="body2">• Sube la nota medio tono</Typography>
                  <Typography variant="body2">• FA# = traste 2 (cuerda E)</Typography>
                  <Typography variant="body2">• DO# = traste 4 (cuerda A)</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Bemol (♭)
                  </Typography>
                  <Typography variant="body2">• Baja la nota medio tono</Typography>
                  <Typography variant="body2">• SI♭ = traste 1 (cuerda A)</Typography>
                  <Typography variant="body2">• MI♭ = traste 1 (cuerda D)</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#f3e5f5' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Becuadro (♮)
                  </Typography>
                  <Typography variant="body2">• Cancela alteraciones</Typography>
                  <Typography variant="body2">• Vuelve a la nota natural</Typography>
                  <Typography variant="body2">• FA♮ después de FA#</Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Armadura de Clave</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fff8e1' }}>
            <Typography variant="body1" gutterBottom>
              Las alteraciones al inicio del pentagrama afectan toda la pieza:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  SOL Mayor (1 sostenido):
                </Typography>
                <Typography variant="body2">• FA# en la armadura</Typography>
                <Typography variant="body2">• Todos los FA son FA#</Typography>
                <Typography variant="body2">• Escala: SOL-LA-SI-DO-RE-MI-FA#-SOL</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  FA Mayor (1 bemol):
                </Typography>
                <Typography variant="body2">• SI♭ en la armadura</Typography>
                <Typography variant="body2">• Todos los SI son SI♭</Typography>
                <Typography variant="body2">• Escala: FA-SOL-LA-SI♭-DO-RE-MI-FA</Typography>
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
        Lecciones de Guitarra
      </Typography>
      
      {guitarLessons.map((lesson) => (
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

export default GuitarLessons;
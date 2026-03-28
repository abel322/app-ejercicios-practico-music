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
import { ExpandMore as ExpandMoreIcon, PlayArrow } from '@mui/icons-material';

interface Lesson {
  id: string;
  title: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  content: React.ReactNode;
}

const PianoLessons: React.FC = () => {
  const [expandedLesson, setExpandedLesson] = useState<string | false>(false);

  const handleLessonChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
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

  const pianoLessons: Lesson[] = [
    {
      id: 'piano-basic-1',
      title: 'El Pentagrama y las Claves',
      level: 'Básico',
      description: 'Aprende las líneas y espacios del pentagrama, clave de sol y clave de fa',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            El Pentagrama
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" gutterBottom>
              El pentagrama son 5 líneas horizontales donde escribimos las notas musicales:
            </Typography>
            <Box sx={{ textAlign: 'center', my: 3, fontFamily: 'monospace', fontSize: '1.2rem', lineHeight: 2 }}>
              <div>5ª línea: ___________________</div>
              <div>4º espacio</div>
              <div>4ª línea: ___________________</div>
              <div>3º espacio</div>
              <div>3ª línea: ___________________</div>
              <div>2º espacio</div>
              <div>2ª línea: ___________________</div>
              <div>1º espacio</div>
              <div>1ª línea: ___________________</div>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Clave de Sol (Mano Derecha)
          </Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e8' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Líneas (de abajo hacia arriba):</strong>
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography>• 1ª línea: MI</Typography>
                  <Typography>• 2ª línea: SOL</Typography>
                  <Typography>• 3ª línea: SI</Typography>
                  <Typography>• 4ª línea: RE</Typography>
                  <Typography>• 5ª línea: FA</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Espacios (de abajo hacia arriba):</strong>
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography>• 1º espacio: FA</Typography>
                  <Typography>• 2º espacio: LA</Typography>
                  <Typography>• 3º espacio: DO</Typography>
                  <Typography>• 4º espacio: MI</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#d4edda', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                💡 Truco: "Mi Sol Si Re Fa" (líneas) y "Fa La Do Mi" (espacios)
              </Typography>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Clave de Fa (Mano Izquierda)
          </Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fff3e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Líneas (de abajo hacia arriba):</strong>
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography>• 1ª línea: SOL</Typography>
                  <Typography>• 2ª línea: SI</Typography>
                  <Typography>• 3ª línea: RE</Typography>
                  <Typography>• 4ª línea: FA</Typography>
                  <Typography>• 5ª línea: LA</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Espacios (de abajo hacia arriba):</strong>
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography>• 1º espacio: LA</Typography>
                  <Typography>• 2º espacio: DO</Typography>
                  <Typography>• 3º espacio: MI</Typography>
                  <Typography>• 4º espacio: SOL</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#ffe0b2', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                💡 Truco: "Sol Si Re Fa La" (líneas) y "La Do Mi Sol" (espacios)
              </Typography>
            </Box>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'piano-basic-2',
      title: 'Figuras Musicales y Compases',
      level: 'Básico',
      description: 'Comprende la duración de las notas, silencios y organización del tiempo',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Figuras Musicales</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f8ff' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Notas (con sonido):
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>𝅝</Typography>
                    <Typography>Redonda = 4 tiempos</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>𝅗𝅥</Typography>
                    <Typography>Blanca = 2 tiempos</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>♩</Typography>
                    <Typography>Negra = 1 tiempo</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>♫</Typography>
                    <Typography>Corchea = 1/2 tiempo</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Silencios (sin sonido):
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>𝄻</Typography>
                    <Typography>Silencio de redonda = 4 tiempos</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>𝄼</Typography>
                    <Typography>Silencio de blanca = 2 tiempos</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>𝄽</Typography>
                    <Typography>Silencio de negra = 1 tiempo</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>𝄾</Typography>
                    <Typography>Silencio de corchea = 1/2 tiempo</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Compases y Métricas</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              El compás organiza el tiempo musical en grupos regulares:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Compás de 4/4
                  </Typography>
                  <Typography variant="body2">• 4 tiempos por compás</Typography>
                  <Typography variant="body2">• La negra vale 1 tiempo</Typography>
                  <Typography variant="body2">• Más común en música popular</Typography>
                  <Box sx={{ mt: 1, fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                    <div>♩ ♩ ♩ ♩ | ♩ ♩ ♩ ♩ |</div>
                    <div>1 2 3 4   1 2 3 4</div>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Compás de 3/4
                  </Typography>
                  <Typography variant="body2">• 3 tiempos por compás</Typography>
                  <Typography variant="body2">• La negra vale 1 tiempo</Typography>
                  <Typography variant="body2">• Común en valses</Typography>
                  <Box sx={{ mt: 1, fontFamily: 'monospace', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                    <div>♩ ♩ ♩ | ♩ ♩ ♩ |</div>
                    <div>1 2 3   1 2 3</div>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Líneas Adicionales</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#fff8e1' }}>
            <Typography variant="body1" gutterBottom>
              Para notas fuera del pentagrama usamos líneas adicionales:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Arriba del pentagrama:
                </Typography>
                <Typography variant="body2">• DO central (línea adicional)</Typography>
                <Typography variant="body2">• RE, MI, FA... (espacios y líneas)</Typography>
                <Typography variant="body2">• Para notas agudas del piano</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Debajo del pentagrama:
                </Typography>
                <Typography variant="body2">• DO central (línea adicional)</Typography>
                <Typography variant="body2">• SI, LA, SOL... (espacios y líneas)</Typography>
                <Typography variant="body2">• Para notas graves del piano</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ),
    },
    {
      id: 'piano-intermediate-1',
      title: 'Acordes en Partitura',
      level: 'Intermedio',
      description: 'Aprende a leer y escribir acordes en notación musical',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>Acordes en Bloque</Typography>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" gutterBottom>
              Los acordes se escriben con las notas apiladas verticalmente:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    DO Mayor
                  </Typography>
                  <Typography variant="body2">Notas: DO - MI - SOL</Typography>
                  <Box sx={{ mt: 1, fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center' }}>
                    <div>♩ (SOL - 5ª línea)</div>
                    <div>♩ (MI - 3º espacio)</div>
                    <div>♩ (DO - línea adicional)</div>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    FA Mayor
                  </Typography>
                  <Typography variant="body2">Notas: FA - LA - DO</Typography>
                  <Box sx={{ mt: 1, fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center' }}>
                    <div>♩ (DO - 3º espacio)</div>
                    <div>♩ (LA - 2º espacio)</div>
                    <div>♩ (FA - 1º espacio)</div>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    SOL Mayor
                  </Typography>
                  <Typography variant="body2">Notas: SOL - SI - RE</Typography>
                  <Box sx={{ mt: 1, fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center' }}>
                    <div>♩ (RE - 4ª línea)</div>
                    <div>♩ (SI - 3ª línea)</div>
                    <div>♩ (SOL - 2ª línea)</div>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>Inversiones de Acordes</Typography>
          <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              Las inversiones cambian qué nota está en el bajo:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Estado fundamental:
                </Typography>
                <Typography variant="body2">DO en el bajo</Typography>
                <Typography variant="body2">DO - MI - SOL</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Primera inversión:
                </Typography>
                <Typography variant="body2">MI en el bajo</Typography>
                <Typography variant="body2">MI - SOL - DO</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Segunda inversión:
                </Typography>
                <Typography variant="body2">SOL en el bajo</Typography>
                <Typography variant="body2">SOL - DO - MI</Typography>
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
        Lecciones de Piano
      </Typography>
      
      {pianoLessons.map((lesson) => (
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

export default PianoLessons;
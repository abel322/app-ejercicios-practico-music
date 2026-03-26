import React from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Paper,
  Stack,
  Chip,
  Divider,
  alpha,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  TrendingUp,
  Speed,
  Accessibility,
  DirectionsRun,
  MusicNote,
  Timer,
} from '@mui/icons-material';

const DrumStudyGuide: React.FC = () => {
  const theme = useTheme();

  const studyPath = [
    {
      id: 1,
      title: 'Rudimentos y Técnica de Manos',
      subtitle: 'El Alfabeto del Baterista',
      icon: <MusicNote />,
      color: theme.palette.primary.main,
      description: 'Los rudimentos son el alfabeto del baterista. Debes practicarlos en el redoblante o en un pad de práctica buscando consistencia en el sonido.',
      exercises: [
        {
          name: 'Single Stroke Roll',
          pattern: 'D I D I',
          focus: 'Igualdad de volumen entre manos',
          description: 'Golpes simples alternados. La base de toda técnica de batería.',
          bpm: '60-120',
        },
        {
          name: 'Double Stroke Roll',
          pattern: 'DD II DD II',
          focus: 'Desarrollar rebote y velocidad',
          description: 'Fundamental para redobles rápidos y fills fluidos.',
          bpm: '60-140',
        },
        {
          name: 'Paradiddles',
          pattern: 'D I D D - I D I I',
          focus: 'Mover el acento y facilitar desplazamientos',
          description: 'Ayudan a navegar por los toms con fluidez y control.',
          bpm: '60-120',
        },
        {
          name: 'Flam y Drags',
          pattern: 'Grace notes + nota principal',
          focus: 'Textura y control de dinámica',
          description: 'Ejercicios de notas de adorno para dar color y expresión.',
          bpm: '50-100',
        },
      ],
    },
    {
      id: 2,
      title: 'Independencia y Coordinación',
      subtitle: 'Cada Extremidad con Vida Propia',
      icon: <Accessibility />,
      color: theme.palette.success.main,
      description: 'El reto de la batería es que cada extremidad haga algo distinto sin que una interfiera con la otra.',
      exercises: [
        {
          name: 'Ostinatos',
          pattern: 'Pies fijos + Manos variables',
          focus: 'Mantener base constante mientras improvisan las manos',
          description: 'Bombo en negras y hi-hat en 2 y 4, mientras las manos hacen rudimentos.',
          bpm: '60-100',
        },
        {
          name: 'Lectura de Síncopa',
          pattern: 'Ritmos sincopados sobre base constante',
          focus: 'Que ninguna extremidad arrastre a la otra',
          description: 'Tocar ritmos complejos de manos sobre una base simple de pies.',
          bpm: '70-120',
        },
        {
          name: 'Linear Chops',
          pattern: 'Mano - Mano - Pie o Mano - Pie - Mano',
          focus: 'No coinciden dos notas al mismo tiempo',
          description: 'Ejercicios lineales donde cada golpe es independiente.',
          bpm: '60-110',
        },
      ],
    },
    {
      id: 3,
      title: 'Control de Pies',
      subtitle: 'Nivelando el Pie Débil',
      icon: <DirectionsRun />,
      color: theme.palette.warning.main,
      description: 'Es común que el pie izquierdo (hi-hat) sea el más débil. Estos ejercicios buscan nivelarlo con el derecho.',
      exercises: [
        {
          name: 'Talón Arriba vs. Talón Abajo',
          pattern: 'Técnicas de pedal',
          focus: 'Potencia vs. Control fino',
          description: 'Practicar ambas técnicas para dominar diferentes situaciones.',
          bpm: '60-140',
        },
        {
          name: 'Control de Bombo',
          pattern: 'Dobles golpes rápidos',
          focus: 'Técnicas de slide o swivel',
          description: 'Dobles con un solo pedal para velocidad sin doble pedal.',
          bpm: '80-160',
        },
        {
          name: 'Independencia del Hi-hat',
          pattern: 'Tiempos 2 y 4, o contratiempos',
          focus: 'Marcar el backbeat mientras tocas grooves',
          description: 'Hi-hat en 2 y 4 mientras tocas ritmos de rock o jazz.',
          bpm: '70-130',
        },
      ],
    },
    {
      id: 4,
      title: 'Groove y Tiempo (Timekeeping)',
      subtitle: 'La Función Principal del Baterista',
      icon: <Timer />,
      color: theme.palette.error.main,
      description: 'Mantener el pulso es la responsabilidad número uno. Todo lo demás es secundario.',
      exercises: [
        {
          name: 'Subdivisiones',
          pattern: 'Negras → Corcheas → Tresillos → Semicorcheas',
          focus: 'Mantener tempo constante en todas las subdivisiones',
          description: 'Pasar entre subdivisiones sin variar el tempo (siempre con metrónomo).',
          bpm: '60-120',
        },
        {
          name: 'Desplazamiento de Acentos',
          pattern: 'Ritmo básico con acento móvil',
          focus: 'Mover el acento a diferentes partes del compás',
          description: 'Tocar el mismo groove pero acentuando diferentes tiempos.',
          bpm: '70-110',
        },
        {
          name: 'Dinámicas',
          pattern: 'Piano (pp) → Forte (ff)',
          focus: 'Mismo ritmo, diferentes volúmenes',
          description: 'Practicar muy suave y muy fuerte sin perder velocidad ni precisión.',
          bpm: '60-100',
        },
      ],
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          p: 4,
          mb: 4,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 4,
            }}
          >
            <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Guía de Estudio de Batería
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Roadmap Profesional: De Principiante a Avanzado
            </Typography>
            <Typography variant="body1" mt={1}>
              Sigue este camino estructurado para desarrollar una técnica sólida y convertirte en un baterista completo.
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Study Path */}
      <Stepper orientation="vertical" sx={{ mb: 4 }}>
        {studyPath.map((section, index) => (
          <Step key={section.id} active={true} expanded={true}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: alpha(section.color, 0.15),
                    border: `3px solid ${section.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: section.color,
                  }}
                >
                  {section.icon}
                </Box>
              )}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold" color={section.color}>
                  {section.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {section.subtitle}
                </Typography>
              </Box>
            </StepLabel>
            <StepContent>
              <Card
                sx={{
                  p: 3,
                  mb: 3,
                  background: `linear-gradient(to bottom, ${alpha(section.color, 0.05)}, white)`,
                  border: `1px solid ${alpha(section.color, 0.2)}`,
                }}
              >
                {/* Description */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: alpha(section.color, 0.08),
                    borderLeft: `4px solid ${section.color}`,
                  }}
                >
                  <Typography variant="body1" fontWeight="500">
                    {section.description}
                  </Typography>
                </Paper>

                {/* Exercises */}
                <Grid container spacing={2}>
                  {section.exercises.map((exercise, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                      <Card
                        sx={{
                          p: 2.5,
                          height: '100%',
                          bgcolor: 'white',
                          border: `1px solid ${alpha(section.color, 0.2)}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-4px)',
                            borderColor: section.color,
                          },
                        }}
                      >
                        <Stack spacing={1.5}>
                          {/* Exercise name */}
                          <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircle sx={{ color: section.color, fontSize: 20 }} />
                            <Typography variant="h6" fontWeight="bold">
                              {exercise.name}
                            </Typography>
                          </Box>

                          {/* Pattern */}
                          <Box
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '1.1rem',
                              bgcolor: '#1a1a1a',
                              color: section.color,
                              p: 1.5,
                              borderRadius: 1,
                              textAlign: 'center',
                              fontWeight: 'bold',
                            }}
                          >
                            {exercise.pattern}
                          </Box>

                          {/* Focus */}
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: alpha(section.color, 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" fontWeight="bold" color={section.color}>
                              ENFOQUE:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {exercise.focus}
                            </Typography>
                          </Box>

                          {/* Description */}
                          <Typography variant="body2" color="text.secondary">
                            {exercise.description}
                          </Typography>

                          {/* BPM */}
                          <Box display="flex" alignItems="center" gap={1}>
                            <Speed sx={{ fontSize: 18, color: section.color }} />
                            <Typography variant="caption" fontWeight="bold">
                              BPM: {exercise.bpm}
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Tips section */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    borderLeft: `4px solid ${theme.palette.info.main}`,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                    💡 Consejos de Práctica
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Usa siempre metrónomo para desarrollar tiempo interno"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Comienza lento y aumenta gradualmente el tempo"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Practica cada ejercicio 10-15 minutos diarios"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUnchecked sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Graba tu práctica para identificar áreas de mejora"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Card>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Practice Schedule Suggestion */}
      <Card
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
          border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
          📅 Rutina de Práctica Sugerida (60 minutos)
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {[
            { time: '10 min', activity: 'Calentamiento con Single y Double Strokes', color: 'primary' },
            { time: '15 min', activity: 'Rudimentos (Paradiddles, Flams, Drags)', color: 'secondary' },
            { time: '15 min', activity: 'Independencia y Coordinación', color: 'success' },
            { time: '10 min', activity: 'Control de Pies', color: 'warning' },
            { time: '10 min', activity: 'Groove y Timekeeping con metrónomo', color: 'error' },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette[item.color as keyof typeof theme.palette].main, 0.1),
                  border: `2px solid ${alpha(theme.palette[item.color as keyof typeof theme.palette].main, 0.3)}`,
                }}
              >
                <Chip
                  label={item.time}
                  size="small"
                  sx={{
                    bgcolor: theme.palette[item.color as keyof typeof theme.palette].main,
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                />
                <Typography variant="body2" fontWeight="500">
                  {item.activity}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
};

export default DrumStudyGuide;

import React, { useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const DrumStudyGuide: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const studyPath = [
    {
      id: 1,
      title: 'Rudimentos y Técnica de Manos',
      subtitle: 'El Alfabeto del Baterista',
      icon: <MusicNote />,
      color: theme.palette.primary.main,
      description: 'Los rudimentos son el alfabeto del baterista. Dominar estos patrones fundamentales es esencial para desarrollar velocidad, control y musicalidad en la batería.',
      books: [
        {
          id: 'stick-control',
          title: 'Stick Control - George Lawrence Stone',
          subtitle: 'Método Fundamental de Control de Baquetas',
          description: '⚠️ REGLA DE ORO: Practica cada ejercicio 20 veces sin parar antes de pasar al siguiente. Esta es la recomendación del autor para obtener resultados satisfactorios. Enfócate en la igualdad de sonido entre ambas manos y usa siempre metrónomo.',
          exercises: [
            {
              name: 'Single Beat Combinations',
              pattern: 'Páginas 5, 6 y 7',
              focus: 'Control básico y alternancia de manos',
              description: 'Patrones fundamentales de golpes simples. Base de toda técnica.',
              bpm: '60-120',
            },
            {
              name: 'Triplets',
              pattern: 'Páginas 8 y 9',
              focus: 'Subdivisión en tresillos',
              description: 'Desarrollo de fluidez en grupos de tres notas.',
              bpm: '60-100',
            },
            {
              name: 'Short Roll Combinations (Single Beat Rolls)',
              pattern: 'Página 10',
              focus: 'Redobles cortos con golpes simples',
              description: 'Introducción a redobles de 5, 7 y 9 golpes.',
              bpm: '50-100',
            },
            {
              name: 'Short Roll Combinations (Double Beat Rolls)',
              pattern: 'Página 11',
              focus: 'Redobles con golpes dobles',
              description: 'Desarrollo de rebote controlado en redobles.',
              bpm: '50-110',
            },
            {
              name: 'Short Roll Combinations',
              pattern: 'Página 12',
              focus: 'Combinaciones mixtas de redobles',
              description: 'Integración de diferentes tipos de redobles.',
              bpm: '50-100',
            },
            {
              name: 'Review of Short Roll Combinations',
              pattern: 'Página 13',
              focus: 'Repaso y consolidación',
              description: 'Revisión de patrones de redobles aprendidos.',
              bpm: '60-110',
            },
            {
              name: 'Short Rolls and Triplets',
              pattern: 'Páginas 14 y 15',
              focus: 'Redobles en contexto de tresillos',
              description: 'Combinación de redobles con subdivisión ternaria.',
              bpm: '50-100',
            },
            {
              name: 'Flam Beats',
              pattern: 'Páginas 16, 17, 18, 19, 20, 21, 22 y 23',
              focus: 'Técnica de flam y aplicación rítmica',
              description: 'Desarrollo de flams limpios y controlados. Sección extensa y fundamental.',
              bpm: '50-90',
            },
            {
              name: 'Short Rolls in 6/8',
              pattern: 'Páginas 24, 25, 26 y 27',
              focus: 'Redobles en compás compuesto',
              description: 'Adaptación de redobles a métrica de 6/8.',
              bpm: '60-100',
            },
            {
              name: 'Review of Short Rolls in 6/8',
              pattern: 'Página 28',
              focus: 'Consolidación en 6/8',
              description: 'Repaso de patrones en compás compuesto.',
              bpm: '60-100',
            },
            {
              name: 'Review of Short Roll in 6/8',
              pattern: 'Página 29',
              focus: 'Repaso adicional en 6/8',
              description: 'Refuerzo de conceptos de redobles en compás compuesto.',
              bpm: '60-100',
            },
            {
              name: 'Combinations in 3/8',
              pattern: 'Páginas 30, 31 y 32',
              focus: 'Patrones en compás de 3/8',
              description: 'Ejercicios en métrica de tres octavos.',
              bpm: '70-120',
            },
            {
              name: 'Combinations in 2/4',
              pattern: 'Página 33',
              focus: 'Patrones en compás de 2/4',
              description: 'Desarrollo rítmico en dos por cuatro.',
              bpm: '70-130',
            },
            {
              name: 'Flam Triplets and Dotted Notes',
              pattern: 'Páginas 34, 35, 36 y 37',
              focus: 'Flams en tresillos y notas con puntillo',
              description: 'Técnica avanzada de flams con subdivisiones complejas.',
              bpm: '50-90',
            },
            {
              name: 'Short Roll Progressions',
              pattern: 'Páginas 38, 39, 40, 41, 42 y 43',
              focus: 'Progresiones de redobles',
              description: 'Secuencias progresivas de redobles cortos. Sección extensa.',
              bpm: '50-100',
            },
            {
              name: 'Short Roll Progressions and Triplets',
              pattern: 'Páginas 44, 45 y 46',
              focus: 'Progresiones con tresillos',
              description: 'Combinación final de redobles y subdivisión ternaria.',
              bpm: '50-100',
            },
          ],
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

      {/* Study Path - Accordions */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {studyPath.map((section, index) => (
          <Accordion
            key={section.id}
            expanded={expanded === section.id}
            onChange={handleAccordionChange(section.id)}
            sx={{
              border: `2px solid ${alpha(section.color, 0.3)}`,
              borderRadius: '12px !important',
              overflow: 'hidden',
              '&:before': { display: 'none' },
              boxShadow: expanded === section.id ? 4 : 2,
              transition: 'all 0.3s',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: section.color, fontSize: 32 }} />}
              sx={{
                background: `linear-gradient(135deg, ${alpha(section.color, 0.1)} 0%, ${alpha(section.color, 0.05)} 100%)`,
                minHeight: 80,
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(section.color, 0.15)} 0%, ${alpha(section.color, 0.08)} 100%)`,
                },
                '& .MuiAccordionSummary-content': {
                  my: 2,
                },
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center" width="100%">
                {/* Icon Circle */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: alpha(section.color, 0.15),
                    border: `3px solid ${section.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: section.color,
                    flexShrink: 0,
                  }}
                >
                  {section.icon}
                </Box>

                {/* Title and Subtitle */}
                <Box flex={1}>
                  <Typography variant="h5" fontWeight="bold" color={section.color} gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {section.subtitle}
                  </Typography>
                </Box>

                {/* Step Number */}
                <Chip
                  label={`Paso ${section.id}`}
                  sx={{
                    bgcolor: section.color,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    height: 36,
                  }}
                />
              </Stack>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                p: 4,
                background: `linear-gradient(to bottom, ${alpha(section.color, 0.02)}, white)`,
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

                {/* Books - Nested Accordions */}
                {section.books ? (
                  <Stack spacing={2}>
                    {section.books.map((book: any) => (
                      <Accordion
                        key={book.id}
                        sx={{
                          border: `2px solid ${alpha(section.color, 0.2)}`,
                          borderRadius: '8px !important',
                          '&:before': { display: 'none' },
                          boxShadow: 2,
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: section.color }} />}
                          sx={{
                            background: `linear-gradient(90deg, ${alpha(section.color, 0.08)} 0%, ${alpha(section.color, 0.03)} 100%)`,
                            '&:hover': {
                              background: `linear-gradient(90deg, ${alpha(section.color, 0.12)} 0%, ${alpha(section.color, 0.05)} 100%)`,
                            },
                          }}
                        >
                          <Stack spacing={0.5} width="100%">
                            <Typography variant="h6" fontWeight="bold" color={section.color}>
                              📚 {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {book.subtitle}
                            </Typography>
                          </Stack>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 3, bgcolor: alpha(section.color, 0.02) }}>
                          {/* Golden Rule */}
                          <Paper
                            elevation={3}
                            sx={{
                              p: 3,
                              mb: 3,
                              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.15)} 100%)`,
                              border: `3px solid ${theme.palette.warning.main}`,
                              borderRadius: 2,
                            }}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.warning.main,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '2rem',
                                }}
                              >
                                ⚠️
                              </Box>
                              <Box flex={1}>
                                <Typography variant="h6" fontWeight="bold" color="warning.main" gutterBottom>
                                  REGLA DE ORO DEL AUTOR
                                </Typography>
                                <Typography variant="body1" fontWeight="600">
                                  Practica cada ejercicio 20 veces sin parar antes de pasar al siguiente.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                  Esta es la recomendación de George Lawrence Stone para obtener resultados satisfactorios.
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>

                          {/* Book Description */}
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
                              {book.description}
                            </Typography>
                          </Paper>

                          {/* Exercises */}
                          <Grid container spacing={2}>
                            {book.exercises.map((exercise: any, idx: number) => (
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
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <CheckCircle sx={{ color: section.color, fontSize: 20 }} />
                                      <Typography variant="h6" fontWeight="bold">
                                        {exercise.name}
                                      </Typography>
                                    </Box>

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

                                    <Typography variant="body2" color="text.secondary">
                                      {exercise.description}
                                    </Typography>

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
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                ) : (
                  /* Exercises - For sections without books */
                  <Grid container spacing={2}>
                    {section.exercises?.map((exercise: any, idx: number) => (
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
                )}

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
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

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

import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, useTheme, alpha } from '@mui/material';
import { PlayArrow, MusicNote, Timeline, LibraryMusic, StarBorder } from '@mui/icons-material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0a0a',
        color: '#ffffff',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 15 }, pb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative' }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Outfit", "Inter", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '5rem' },
                  lineHeight: 1.1,
                  mb: 3,
                  background: 'linear-gradient(45deg, #ffffff 30%, #a0a0a0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Eleva tu Arte Musical
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mb: 5,
                  fontWeight: 300,
                  lineHeight: 1.6,
                  maxWidth: '600px'
                }}
              >
                Diseñado para músicos que buscan la excelencia. Organiza tus prácticas, sigue tu progreso y alcanza la maestría con herramientas intuitivas y modernas.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<PlayArrow />}
                  sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #6c63ff 30%, #8a2be2 90%)',
                    boxShadow: '0 8px 25px rgba(108, 99, 255, 0.4)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      background: 'linear-gradient(45deg, #5a52e6 30%, #7525bd 90%)',
                    }
                  }}
                >
                  Comenzar Gratis
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                height: '400px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1000px'
              }}
            >
              {/* Representación Abstracta UI */}
              <Paper
                elevation={24}
                sx={{
                  width: '80%',
                  height: '300px',
                  borderRadius: '20px',
                  background: 'rgba(25, 25, 25, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'absolute',
                  transform: 'rotateY(-15deg) rotateX(10deg)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
                </Box>
                <Box sx={{ display: 'flex', flexGrow: 1, gap: 2 }}>
                  <Box sx={{ width: '30%', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ height: '40%', bgcolor: 'rgba(108, 99, 255, 0.2)', borderRadius: 2 }} />
                    <Box sx={{ height: '60%', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#6c63ff', letterSpacing: 2, fontWeight: 600 }}>
            CARACTERÍSTICAS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
            Todo lo que necesitas para practicar
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { icon: <MusicNote fontSize="large" />, title: 'Rutinas Personalizadas', desc: 'Crea y gestiona tus ejercicios y libros por cada instrumento.' },
            { icon: <Timeline fontSize="large" />, title: 'Seguimiento de Progreso', desc: 'Visualiza tu avance a lo largo del tiempo con gráficos detallados.' },
            { icon: <LibraryMusic fontSize="large" />, title: 'Sesiones de Práctica', desc: 'Organiza sesiones completas con temporizadores incorporados.' },
            { icon: <StarBorder fontSize="large" />, title: 'Metas y Recomendaciones', desc: 'Alcanza tus objetivos musicales con sugerencias de estudio.' }
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  transition: 'transform 0.3s, background 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                <Box sx={{ color: '#6c63ff', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

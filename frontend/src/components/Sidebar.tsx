import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as BookIcon,
  FitnessCenter as ExerciseIcon,
  PlayCircle as PracticeIcon,
  MusicNote as MusicNoteIcon,
  History as SessionIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as LevelIcon,
  Flag as GoalIcon,
  Lightbulb as RecommendationIcon,
  Timeline as PredictionIcon,
  Person as ProfileIcon,
  Download as ExportIcon,
  CheckCircle as ProgressIcon,
  Piano as PianoIcon,
  MusicNote as GuitarIcon,
  Album as DrumsIcon,
  GraphicEq as BassIcon,
  ExpandMore as ExpandMoreIcon,
  School,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface Instrument {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
}

const instruments: Instrument[] = [
  { id: 'PIANO', name: 'Piano', icon: <PianoIcon />, color: '#6366F1' },
  { id: 'GUITAR', name: 'Guitarra', icon: <GuitarIcon />, color: '#EC4899' },
  { id: 'DRUMS', name: 'Batería', icon: <DrumsIcon />, color: '#F59E0B' },
  { id: 'BASS', name: 'Bajo', icon: <BassIcon />, color: '#10B981' },
];

const generalMenuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Lecciones', icon: <School />, path: '/lessons' },
  { text: 'Perfil', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Exportar', icon: <ExportIcon />, path: '/export' },
];

const instrumentMenuItems: MenuItem[] = [
  { text: 'Libros', icon: <BookIcon />, path: '/books' },
  { text: 'Ejercicios', icon: <ExerciseIcon />, path: '/exercises' },
  { text: 'Progreso', icon: <ProgressIcon />, path: '/exercise-progress' },
  { text: 'Práctica', icon: <MusicNoteIcon />, path: '/practice-session' },
  { text: 'Sesiones', icon: <SessionIcon />, path: '/sessions' },
  { text: 'Calendario', icon: <CalendarIcon />, path: '/calendar' },
  { text: 'Nivel', icon: <LevelIcon />, path: '/level' },
  { text: 'Predicciones', icon: <PredictionIcon />, path: '/predictions' },
  { text: 'Metas', icon: <GoalIcon />, path: '/goals' },
  { text: 'Recomendaciones', icon: <RecommendationIcon />, path: '/recommendations' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedInstrument, setExpandedInstrument] = useState<string | null>(null);

  const handleNavigation = (path: string, instrument?: string) => {
    const finalPath = instrument ? `/${instrument.toLowerCase()}${path}` : path;
    navigate(finalPath);
    onClose();
  };

  const handleInstrumentToggle = (instrumentId: string) => {
    setExpandedInstrument(expandedInstrument === instrumentId ? null : instrumentId);
  };

  const isPathSelected = (path: string, instrument?: string) => {
    const finalPath = instrument ? `/${instrument.toLowerCase()}${path}` : path;
    return location.pathname === finalPath;
  };

  const isInstrumentActive = (instrumentId: string) => {
    return location.pathname.startsWith(`/${instrumentId.toLowerCase()}/`);
  };

  const drawerContent = (
    <Box 
      role="navigation" 
      aria-label="Menú de navegación principal"
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#F1F5F9',
        overflow: 'auto',
      }}
    >
      {/* Logo y título */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          🎵
        </Box>
        <Box>
          <Box sx={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
            Music
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            Practice App
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)' }} />
      
      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {/* Menú general */}
        <Typography variant="overline" sx={{ px: 2, color: '#64748B', fontSize: '0.7rem', fontWeight: 600 }}>
          General
        </Typography>
        {generalMenuItems.map((item) => {
          const isSelected = isPathSelected(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? '#FFFFFF' : '#94A3B8', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)', my: 2 }} />

        {/* Instrumentos */}
        <Typography variant="overline" sx={{ px: 2, color: '#64748B', fontSize: '0.7rem', fontWeight: 600 }}>
          Instrumentos
        </Typography>
        {instruments.map((instrument) => {
          const isActive = isInstrumentActive(instrument.id);
          const isExpanded = expandedInstrument === instrument.id;
          
          return (
            <Box key={instrument.id} sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleInstrumentToggle(instrument.id)}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 2,
                  mb: 0.5,
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: instrument.color, minWidth: 40 }}>
                  {instrument.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>
                        {instrument.name}
                      </Typography>
                      {isActive && (
                        <Chip 
                          size="small" 
                          label="Activo" 
                          sx={{ 
                            height: 16, 
                            fontSize: '0.6rem',
                            backgroundColor: instrument.color,
                            color: 'white'
                          }} 
                        />
                      )}
                    </Box>
                  }
                />
                <ExpandMoreIcon 
                  sx={{ 
                    color: '#94A3B8',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </ListItemButton>

              {/* Submenú del instrumento */}
              {isExpanded && (
                <Box sx={{ pl: 2 }}>
                  {instrumentMenuItems.map((item) => {
                    const isSelected = isPathSelected(item.path, instrument.id);
                    return (
                      <ListItem key={`${instrument.id}-${item.path}`} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          selected={isSelected}
                          onClick={() => handleNavigation(item.path, instrument.id)}
                          sx={{
                            borderRadius: '8px',
                            py: 1,
                            px: 2,
                            ml: 1,
                            transition: 'all 0.2s ease',
                            '&.Mui-selected': {
                              backgroundColor: instrument.color,
                              color: '#FFFFFF',
                              '&:hover': {
                                backgroundColor: instrument.color,
                              },
                            },
                            '&:hover': {
                              backgroundColor: `${instrument.color}20`,
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: isSelected ? '#FFFFFF' : instrument.color, minWidth: 32 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              fontSize: '0.85rem',
                              fontWeight: isSelected ? 600 : 500,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Drawer temporal para móvil */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en móvil
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          },
        }}
        aria-label="Menú de navegación móvil"
      >
        {drawerContent}
      </Drawer>

      {/* Drawer permanente para desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          },
        }}
        open
        aria-label="Menú de navegación"
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

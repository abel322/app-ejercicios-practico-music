import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { mode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Botón de menú (solo visible en móvil) */}
        <IconButton
          color="primary"
          aria-label="abrir menú"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Título de la aplicación */}
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: 'text.primary',
            fontWeight: 700,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Dashboard
        </Typography>

        {/* Controles de la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Nombre de usuario */}
          {user && (
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: '12px',
                backgroundColor: 'action.hover',
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Box>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {user.name}
              </Typography>
            </Box>
          )}

          {/* Toggle de tema */}
          <Tooltip title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}>
            <IconButton 
              color="primary" 
              onClick={toggleTheme} 
              aria-label="cambiar tema"
              sx={{
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Botón de logout */}
          <Tooltip title="Cerrar sesión">
            <IconButton 
              color="primary" 
              onClick={logout} 
              aria-label="cerrar sesión"
              sx={{
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

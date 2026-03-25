import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, AvatarGroup } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

interface ColorfulCardProps {
  title: string;
  subtitle?: string;
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
  icon?: React.ReactNode;
  members?: number;
  date?: string;
  onClick?: () => void;
}

const colorSchemes = {
  red: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    shadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
  },
  blue: {
    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    shadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
  },
  yellow: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    shadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
  },
  green: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    shadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
  },
  purple: {
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    shadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
  },
  orange: {
    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    shadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
  },
};

const ColorfulCard: React.FC<ColorfulCardProps> = ({
  title,
  subtitle,
  color,
  icon,
  members,
  date,
  onClick,
}) => {
  const scheme = colorSchemes[color];

  return (
    <Card
      onClick={onClick}
      sx={{
        background: scheme.background,
        color: 'white',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        height: '100%',
        minHeight: 180,
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: scheme.shadow,
        },
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Icono y menú */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon || <FolderIcon sx={{ fontSize: 28 }} />}
          </Box>
        </Box>

        {/* Título */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>

        {/* Subtítulo */}
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {/* Footer con miembros y fecha */}
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {members && members > 0 && (
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
              {Array.from({ length: Math.min(members, 3) }).map((_, i) => (
                <Avatar key={i} sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}>
                  {String.fromCharCode(65 + i)}
                </Avatar>
              ))}
            </AvatarGroup>
          )}
          {date && (
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {date}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ColorfulCard;

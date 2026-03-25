import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card
      role="article"
      aria-label={`Estadística: ${title}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            aria-hidden="true"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.direction === 'up' ? (
              <TrendingUp 
                sx={{ color: 'success.main', mr: 0.5 }} 
                fontSize="small"
                aria-hidden="true"
              />
            ) : (
              <TrendingDown 
                sx={{ color: 'error.main', mr: 0.5 }} 
                fontSize="small"
                aria-hidden="true"
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend.direction === 'up' ? 'success.main' : 'error.main',
              }}
              aria-label={`Tendencia ${trend.direction === 'up' ? 'positiva' : 'negativa'}: ${trend.value} por ciento`}
            >
              {trend.value}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;

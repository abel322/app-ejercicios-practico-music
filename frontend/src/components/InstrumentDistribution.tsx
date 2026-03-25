import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { InstrumentDistributionData } from '../types/dashboard.types';

interface InstrumentDistributionProps {
  data: InstrumentDistributionData[];
  loading?: boolean;
}

// Colors for each instrument
const COLORS: Record<string, string> = {
  PIANO: '#5E35B1',
  GUITAR: '#1E88E5',
  BASS: '#43A047',
  DRUMS: '#E53935',
};

const InstrumentDistribution: React.FC<InstrumentDistributionProps> = ({
  data,
  loading = false,
}) => {
  // Format instrument names for display
  const formatInstrument = (instrument: string) => {
    const names: Record<string, string> = {
      PIANO: 'Piano',
      GUITAR: 'Guitarra',
      BASS: 'Bajo',
      DRUMS: 'Batería',
    };
    return names[instrument] || instrument;
  };

  // Format chart data
  const chartData = data.map((item) => ({
    name: formatInstrument(item.instrument),
    value: item.minutes,
    instrument: item.instrument,
  }));

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Distribución por Instrumento
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Distribución por Instrumento
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No hay datos para mostrar
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Distribución por Instrumento
        </Typography>
        <Box sx={{ width: '100%', height: 300, mt: 2 }} role="img" aria-label="Gráfico circular de distribución de práctica por instrumento">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.instrument] || '#999'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value} minutos`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InstrumentDistribution;

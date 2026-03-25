import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { PracticeChartData } from '../types/dashboard.types';

interface PracticeChartProps {
  data: PracticeChartData[];
  loading?: boolean;
}

const PracticeChart: React.FC<PracticeChartProps> = ({ data, loading = false }) => {
  // Format date for display (e.g., "12/25" or "25 Dic")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  // Format chart data
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    minutos: item.minutes,
  }));

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tiempo de Práctica (Últimos 30 días)
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
            Tiempo de Práctica (Últimos 30 días)
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
          Tiempo de Práctica (Últimos 30 días)
        </Typography>
        <Box sx={{ width: '100%', height: 300, mt: 2 }} role="img" aria-label="Gráfico de barras mostrando minutos de práctica por día en los últimos 30 días">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Bar
                dataKey="minutos"
                fill="#5E35B1"
                name="Minutos de práctica"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PracticeChart;

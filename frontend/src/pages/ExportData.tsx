import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TableChart as TableChartIcon,
  DataObject as DataObjectIcon,
} from '@mui/icons-material';
import { exportService } from '../services/exportService';
import { useNotification } from '../contexts/NotificationContext';

const ExportData: React.FC = () => {
  const [loadingJSON, setLoadingJSON] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const { showNotification } = useNotification();

  const handleExportJSON = async () => {
    setLoadingJSON(true);
    try {
      await exportService.exportData();
      showNotification('Datos exportados exitosamente en formato JSON', 'success');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      showNotification('Error al exportar los datos. Por favor, intenta de nuevo.', 'error');
    } finally {
      setLoadingJSON(false);
    }
  };

  const handleExportCSV = async () => {
    setLoadingCSV(true);
    try {
      await exportService.exportStats();
      showNotification('Estadísticas exportadas exitosamente en formato CSV', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showNotification('Error al exportar las estadísticas. Por favor, intenta de nuevo.', 'error');
    } finally {
      setLoadingCSV(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Exportar Datos
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Descarga tus datos de práctica para hacer respaldos o análisis externos.
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          Los archivos se descargarán automáticamente en tu navegador. Asegúrate de permitir las
          descargas si tu navegador lo solicita.
        </Alert>

        <Grid container spacing={3}>
          {/* JSON Export Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DataObjectIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h2">
                    Datos Completos (JSON)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Exporta todos tus datos incluyendo:
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Información de usuario
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Libros y ejercicios
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Sesiones de práctica completas
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Metadatos de exportación
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Formato ideal para respaldos completos y migración de datos.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loadingJSON ? <CircularProgress size={20} /> : <DownloadIcon />}
                  onClick={handleExportJSON}
                  disabled={loadingJSON || loadingCSV}
                  fullWidth
                >
                  {loadingJSON ? 'Exportando...' : 'Exportar JSON'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* CSV Export Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TableChartIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Typography variant="h5" component="h2">
                    Estadísticas (CSV)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Exporta tus estadísticas de práctica incluyendo:
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Fecha de cada sesión
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Duración en minutos
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Ejercicios practicados
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Notas de sesión
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Formato ideal para análisis en Excel, Google Sheets u otras herramientas.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={loadingCSV ? <CircularProgress size={20} /> : <DownloadIcon />}
                  onClick={handleExportCSV}
                  disabled={loadingJSON || loadingCSV}
                  fullWidth
                >
                  {loadingCSV ? 'Exportando...' : 'Exportar CSV'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Información sobre los archivos
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Los archivos exportados incluyen la fecha actual en el nombre para facilitar la
            organización de tus respaldos:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>JSON:</strong> data-export-YYYY-MM-DD.json
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>CSV:</strong> practice-stats-YYYY-MM-DD.csv
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ExportData;

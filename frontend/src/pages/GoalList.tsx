import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import GoalForm from '../components/GoalForm';
import GoalHistory from '../components/GoalHistory';

interface GoalListProps {
  instrument?: string;
}

const GoalList: React.FC<GoalListProps> = ({ instrument }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Helper para obtener nombre del instrumento
  const getInstrumentName = (instrumentId: string) => {
    const names: Record<string, string> = {
      PIANO: 'Piano',
      GUITAR: 'Guitarra', 
      DRUMS: 'Batería',
      BASS: 'Bajo'
    };
    return names[instrumentId] || instrumentId;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSuccess = () => {
    setOpenDialog(false);
    setRefreshKey((prev) => prev + 1); // Trigger refresh of GoalHistory
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Metas de Práctica
              {instrument && (
                <Typography variant="h6" component="span" color="primary" sx={{ ml: 2 }}>
                  - {getInstrumentName(instrument)}
                </Typography>
              )}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Establece y gestiona tus metas de práctica{instrument ? ` de ${getInstrumentName(instrument)}` : ''} diarias y semanales.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Nueva Meta
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <GoalHistory key={refreshKey} onRefresh={handleRefresh} instrument={instrument} />
          </Grid>
        </Grid>

        {/* Dialog for creating new goal */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Crear Nueva Meta
            {instrument && (
              <Typography variant="subtitle1" color="primary" sx={{ mt: 0.5 }}>
                {getInstrumentName(instrument)}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <GoalForm onSuccess={handleSuccess} onCancel={handleCloseDialog} instrument={instrument} />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default GoalList;

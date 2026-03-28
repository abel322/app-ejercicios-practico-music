import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Piano as PianoIcon,
  MusicNote as GuitarIcon,
  Album as DrumsIcon,
  GraphicEq as BassIcon,
  School,
} from '@mui/icons-material';
import PianoLessons from '../components/lessons/PianoLessons';
import GuitarLessons from '../components/lessons/GuitarLessons';
import DrumLessons from '../components/lessons/DrumLessons';
import BassLessons from '../components/lessons/BassLessons';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MusicLessons: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <School sx={{ fontSize: 40, color: 'primary.main' }} />
            Lecciones de Partitura
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aprende a leer partituras de forma visual e intuitiva para cada instrumento
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              },
            }}
          >
            <Tab 
              icon={<PianoIcon />} 
              label="Piano" 
              iconPosition="start" 
              sx={{ 
                gap: 1, 
                color: '#6366F1',
                '&.Mui-selected': { color: '#6366F1' }
              }} 
            />
            <Tab 
              icon={<GuitarIcon />} 
              label="Guitarra" 
              iconPosition="start" 
              sx={{ 
                gap: 1, 
                color: '#EC4899',
                '&.Mui-selected': { color: '#EC4899' }
              }} 
            />
            <Tab 
              icon={<DrumsIcon />} 
              label="Batería" 
              iconPosition="start" 
              sx={{ 
                gap: 1, 
                color: '#F59E0B',
                '&.Mui-selected': { color: '#F59E0B' }
              }} 
            />
            <Tab 
              icon={<BassIcon />} 
              label="Bajo" 
              iconPosition="start" 
              sx={{ 
                gap: 1, 
                color: '#10B981',
                '&.Mui-selected': { color: '#10B981' }
              }} 
            />
          </Tabs>

          {/* Tab Panels */}
          <TabPanel value={currentTab} index={0}>
            <PianoLessons />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <GuitarLessons />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <DrumLessons />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <BassLessons />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default MusicLessons;
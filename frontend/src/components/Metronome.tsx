import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
  Slider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from '@mui/icons-material';

interface MetronomeProps {
  initialTempo?: number;
  onTempoChange?: (tempo: number) => void;
}

export interface MetronomeRef {
  start: () => void;
  stop: () => void;
  isPlaying: () => boolean;
}

const Metronome = forwardRef<MetronomeRef, MetronomeProps>(({ 
  initialTempo = 120, 
  onTempoChange,
}, ref) => {
  const [tempo, setTempo] = useState(initialTempo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);

  // Inicializar AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Función para reproducir un click
  const playClick = useCallback((time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    osc.frequency.value = isAccent ? 1000 : 800;
    gain.gain.value = isAccent ? 0.8 : 0.5;

    osc.start(time);
    osc.stop(time + 0.05);
  }, []);

  // Scheduler del metrónomo
  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    const scheduleAheadTime = 0.1;
    const currentTime = audioContextRef.current.currentTime;

    while (nextNoteTimeRef.current < currentTime + scheduleAheadTime) {
      const isAccent = accentFirstBeat && currentBeatRef.current === 0;
      playClick(nextNoteTimeRef.current, isAccent);
      
      setCurrentBeat(currentBeatRef.current);
      
      const secondsPerBeat = 60.0 / tempo;
      nextNoteTimeRef.current += secondsPerBeat;
      
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
    }

    timerIdRef.current = window.setTimeout(scheduler, 25);
  }, [tempo, beatsPerMeasure, accentFirstBeat, playClick]);

  // Función para iniciar
  const start = useCallback(() => {
    if (!audioContextRef.current || isPlaying) return;

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    setIsPlaying(true);
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    scheduler();
  }, [scheduler, isPlaying]);

  // Función para detener
  const stop = useCallback(() => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    setCurrentBeat(0);
    currentBeatRef.current = 0;
    
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend();
    }
  }, [isPlaying]);

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    start,
    stop,
    isPlaying: () => isPlaying,
  }), [start, stop, isPlaying]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  // Manejar cambio de tempo
  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
    if (onTempoChange) {
      onTempoChange(newTempo);
    }
  };

  return (
    <Paper sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} elevation={1}>
      <Typography variant="body2" gutterBottom fontWeight={600}>
        Metrónomo
      </Typography>

      {/* Display del tempo */}
      <Box sx={{ textAlign: 'center', my: 0.75 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {tempo}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          BPM
        </Typography>
      </Box>

      {/* Slider de tempo */}
      <Box sx={{ px: 0.5, mb: 0.75 }}>
        <Slider
          value={tempo}
          onChange={(_, value) => handleTempoChange(value as number)}
          min={40}
          max={240}
          step={1}
          marks={[
            { value: 40, label: '40' },
            { value: 120, label: '120' },
            { value: 240, label: '240' },
          ]}
          disabled={isPlaying}
          size="small"
        />
      </Box>

      {/* Input de tempo y compás */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.75 }}>
        <TextField
          label="BPM"
          type="number"
          value={tempo}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 40 && value <= 240) {
              handleTempoChange(value);
            }
          }}
          inputProps={{ min: 40, max: 240 }}
          disabled={isPlaying}
          size="small"
          fullWidth
        />
        
        <FormControl fullWidth disabled={isPlaying} size="small">
          <InputLabel>Compás</InputLabel>
          <Select
            value={beatsPerMeasure}
            label="Compás"
            onChange={(e) => setBeatsPerMeasure(e.target.value as number)}
          >
            <MenuItem value={2}>2/4</MenuItem>
            <MenuItem value={3}>3/4</MenuItem>
            <MenuItem value={4}>4/4</MenuItem>
            <MenuItem value={5}>5/4</MenuItem>
            <MenuItem value={6}>6/8</MenuItem>
            <MenuItem value={7}>7/8</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Indicador visual de beats */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 0.75, flexWrap: 'wrap' }}>
        {Array.from({ length: beatsPerMeasure }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: 1.5,
              borderColor: index === 0 && accentFirstBeat ? 'error.main' : 'primary.main',
              bgcolor: isPlaying && currentBeat === index 
                ? (index === 0 && accentFirstBeat ? 'error.main' : 'primary.main')
                : 'transparent',
              transition: 'background-color 0.1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" fontWeight="bold" fontSize="0.65rem">
              {index + 1}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Opciones */}
      <Box sx={{ mb: 0.75 }}>
        <FormControlLabel
          control={
            <Switch
              checked={accentFirstBeat}
              onChange={(e) => setAccentFirstBeat(e.target.checked)}
              disabled={isPlaying}
              size="small"
            />
          }
          label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Acentuar 1er tiempo</Typography>}
        />
      </Box>

      {/* Controles */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
        {!isPlaying ? (
          <IconButton
            onClick={start}
            color="primary"
            size="medium"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              width: 44,
              height: 44,
            }}
          >
            <PlayIcon sx={{ fontSize: 22 }} />
          </IconButton>
        ) : (
          <>
            <IconButton
              onClick={stop}
              color="warning"
              size="medium"
              sx={{
                bgcolor: 'warning.main',
                color: 'white',
                '&:hover': { bgcolor: 'warning.dark' },
                width: 44,
                height: 44,
              }}
            >
              <PauseIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <IconButton
              onClick={stop}
              color="error"
              size="medium"
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' },
                width: 44,
                height: 44,
              }}
            >
              <StopIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </>
        )}
      </Box>
    </Paper>
  );
});

Metronome.displayName = 'Metronome';

export default Metronome;
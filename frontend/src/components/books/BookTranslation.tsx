import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Translate as TranslateIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface BookTranslationProps {
  bookId: string;
  bookName: string;
  open: boolean;
  onClose: () => void;
}

interface Translation {
  id: string;
  language: string;
  createdAt: string;
}

interface Language {
  code: string;
  name: string;
}

const COMMON_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

export default function BookTranslation({
  bookId,
  bookName,
  open,
  onClose,
}: BookTranslationProps) {
  const [targetLanguage, setTargetLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[]>(COMMON_LANGUAGES);

  useEffect(() => {
    if (open) {
      loadTranslations();
      loadLanguages();
    }
  }, [open, bookId]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/translations/book/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTranslations(response.data.data);
    } catch (err) {
      console.error('Error loading translations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLanguages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/translations/languages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.data.length > 0) {
        setLanguages(response.data.data);
      }
    } catch (err) {
      console.error('Error loading languages:', err);
      // Usar idiomas comunes si falla
    }
  };

  const handleTranslate = async () => {
    if (!targetLanguage) {
      setError('Por favor selecciona un idioma');
      return;
    }

    try {
      setTranslating(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/translations/translate-book`,
        {
          bookId,
          targetLanguage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Traducción completada exitosamente');
      setTargetLanguage('');
      loadTranslations();
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(
        err.response?.data?.message ||
          'Error al traducir el libro. Por favor intenta de nuevo.'
      );
    } finally {
      setTranslating(false);
    }
  };

  const handleDownload = async (translationId: string, language: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/translations/book/${bookId}/${language}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Crear archivo de texto con la traducción
      const blob = new Blob([response.data.data.translatedContent], {
        type: 'text/plain',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookName}_${language}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Error al descargar la traducción');
    }
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <TranslateIcon />
          Traducir Libro
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Libro: {bookName}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Idioma de destino</InputLabel>
            <Select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              label="Idioma de destino"
              disabled={translating}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleTranslate}
            disabled={!targetLanguage || translating}
            sx={{ mt: 2 }}
            startIcon={translating ? <CircularProgress size={20} /> : <TranslateIcon />}
          >
            {translating ? 'Traduciendo...' : 'Traducir'}
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Traducciones disponibles
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : translations.length === 0 ? (
            <Alert severity="info">
              No hay traducciones disponibles. Crea una nueva traducción arriba.
            </Alert>
          ) : (
            <List>
              {translations.map((translation) => (
                <ListItem
                  key={translation.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() =>
                        handleDownload(translation.id, translation.language)
                      }
                    >
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={getLanguageName(translation.language)}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={`Creada: ${new Date(
                      translation.createdAt
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="caption">
            Nota: La traducción puede tardar varios minutos dependiendo del tamaño
            del libro. El texto traducido se guardará y podrás descargarlo en
            formato TXT.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

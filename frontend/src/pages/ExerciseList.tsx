import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { exerciseService } from '../services/exerciseService';
import { bookService } from '../services/bookService';
import type { Exercise, ExerciseFormData, Difficulty } from '../types/exercise.types';
import type { Book } from '../types/book.types';
import { Difficulty as DifficultyEnum } from '../types/exercise.types';
import { useNotification } from '../contexts/NotificationContext';
import { useDebounce } from '../hooks/useDebounce';

interface ExerciseListProps {
  instrument?: string;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ instrument }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    description: '',
    bookId: '',
    pages: '',
    difficulty: DifficultyEnum.BASIC,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { showNotification } = useNotification();
  const debouncedSearch = useDebounce(searchQuery, 300);

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

  useEffect(() => {
    loadBooks();
  }, [instrument]); // Recargar cuando cambie el instrumento

  useEffect(() => {
    loadExercises();
  }, [debouncedSearch, difficultyFilter, instrument]); // Recargar cuando cambie el instrumento

  const loadBooks = async () => {
    try {
      const data = await bookService.getBooks();
      // Filtrar libros por instrumento si se especifica
      const filteredBooks = instrument 
        ? data.filter(book => book.instrument === instrument)
        : data;
      setBooks(filteredBooks);
    } catch (error) {
      showNotification('Error al cargar los libros', 'error');
    }
  };

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getExercises(
        debouncedSearch || undefined,
        undefined,
        difficultyFilter || undefined
      );
      
      // Filtrar ejercicios por instrumento si se especifica
      const filteredExercises = instrument 
        ? data.filter(exercise => exercise.book?.instrument === instrument)
        : data;
      
      setExercises(filteredExercises);
    } catch (error) {
      showNotification('Error al cargar los ejercicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (exercise?: Exercise) => {
    if (exercise) {
      setSelectedExercise(exercise);
      setFormData({
        name: exercise.name,
        description: exercise.description,
        bookId: exercise.bookId,
        pages: exercise.pages,
        difficulty: exercise.difficulty,
        notes: exercise.notes,
      });
    } else {
      setSelectedExercise(null);
      setFormData({
        name: '',
        description: '',
        bookId: '',
        pages: '',
        difficulty: DifficultyEnum.BASIC,
        notes: '',
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExercise(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    if (!formData.bookId) {
      errors.bookId = 'Debes seleccionar un libro';
    }
    if (!formData.pages.trim()) {
      errors.pages = 'Las páginas son requeridas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (selectedExercise) {
        await exerciseService.updateExercise(selectedExercise.id, formData);
        showNotification('Ejercicio actualizado exitosamente', 'success');
      } else {
        await exerciseService.createExercise(formData);
        showNotification('Ejercicio creado exitosamente', 'success');
      }
      handleCloseDialog();
      loadExercises();
    } catch (error: any) {
      console.error('Error al guardar ejercicio:', error);
      
      // Extraer mensaje de error más específico
      let errorMessage = 'Error al guardar el ejercicio';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        // Error de validación con detalles
        const details = error.response.data.details;
        if (Array.isArray(details) && details.length > 0) {
          errorMessage = details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedExercise(null);
  };

  const handleDelete = async () => {
    if (!selectedExercise) return;

    try {
      await exerciseService.deleteExercise(selectedExercise.id);
      showNotification('Ejercicio eliminado exitosamente', 'success');
      handleCloseDeleteDialog();
      loadExercises();
    } catch (error: any) {
      console.error('Error al eliminar ejercicio:', error);
      
      // Extraer mensaje de error más específico
      let errorMessage = 'Error al eliminar el ejercicio';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
      handleCloseDeleteDialog(); // Cerrar el diálogo incluso si hay error
    }
  };

  const getDifficultyColor = (difficulty: Difficulty): 'success' | 'info' | 'warning' | 'error' => {
    switch (difficulty) {
      case DifficultyEnum.BASIC:
        return 'success';
      case DifficultyEnum.INTERMEDIATE:
        return 'info';
      case DifficultyEnum.ADVANCED:
        return 'warning';
      default:
        return 'info';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case DifficultyEnum.BASIC:
        return 'Básico';
      case DifficultyEnum.INTERMEDIATE:
        return 'Intermedio';
      case DifficultyEnum.ADVANCED:
        return 'Avanzado';
      default:
        return difficulty;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1">
              Ejercicios
              {instrument && (
                <Chip 
                  label={getInstrumentName(instrument)} 
                  color="primary" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Ejercicio
          </Button>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar ejercicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Dificultad</InputLabel>
            <Select
              value={difficultyFilter}
              label="Dificultad"
              onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | '')}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value={DifficultyEnum.BASIC}>Básico</MenuItem>
              <MenuItem value={DifficultyEnum.INTERMEDIATE}>Intermedio</MenuItem>
              <MenuItem value={DifficultyEnum.ADVANCED}>Avanzado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : exercises.length === 0 ? (
          <Alert severity="info">
            {searchQuery || difficultyFilter
              ? 'No se encontraron ejercicios con los filtros aplicados'
              : `No tienes ejercicios aún${instrument ? ` de ${getInstrumentName(instrument)}` : ''}. ¡Crea tu primer ejercicio!`}
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''} encontrado{exercises.length !== 1 ? 's' : ''}
            </Typography>
            <Grid container spacing={3}>
              {exercises.map((exercise) => (
                <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {exercise.name}
                      </Typography>
                      {exercise.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {exercise.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BookIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {exercise.book?.name || 'Libro no disponible'}
                          {exercise.book?.instrument && (
                            <Chip 
                              label={getInstrumentName(exercise.book.instrument)} 
                              size="small" 
                              color="secondary" 
                              sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
                            />
                          )}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Páginas: {exercise.pages}
                      </Typography>
                      <Chip
                        label={getDifficultyLabel(exercise.difficulty)}
                        color={getDifficultyColor(exercise.difficulty)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      {exercise.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                          {exercise.notes}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(exercise)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(exercise)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Dialog para crear/editar ejercicio */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            {instrument && (
              <Chip 
                label={getInstrumentName(instrument)} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }} 
              />
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
                fullWidth
              />
              <TextField
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
              <FormControl fullWidth required error={!!formErrors.bookId}>
                <InputLabel>Libro</InputLabel>
                <Select
                  value={formData.bookId}
                  label="Libro"
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                >
                  {books.map((book) => (
                    <MenuItem key={book.id} value={book.id}>
                      {book.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.bookId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {formErrors.bookId}
                  </Typography>
                )}
              </FormControl>
              <TextField
                label="Páginas"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                error={!!formErrors.pages}
                helperText={formErrors.pages || 'Ej: "1-5", "10", "15-20"'}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Dificultad</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Dificultad"
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                >
                  <MenuItem value={DifficultyEnum.BASIC}>Básico</MenuItem>
                  <MenuItem value={DifficultyEnum.INTERMEDIATE}>Intermedio</MenuItem>
                  <MenuItem value={DifficultyEnum.ADVANCED}>Avanzado</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Notas"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : selectedExercise ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar el ejercicio "{selectedExercise?.name}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Nota: Los registros históricos de sesiones que usaron este ejercicio se mantendrán.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ExerciseList;

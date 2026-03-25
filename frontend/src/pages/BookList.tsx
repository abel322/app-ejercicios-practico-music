import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { bookService } from '../services/bookService';
import type { Book, BookFormData } from '../types/book.types';
import { Instrument } from '../types/auth.types';
import { useNotification } from '../contexts/NotificationContext';
import { useDebounce } from '../hooks/useDebounce';
import PDFViewer from '../components/PDFViewer';

const ITEMS_PER_PAGE = 20;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface BookListProps {
  instrument?: string;
}

const BookList: React.FC<BookListProps> = ({ instrument }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState<Instrument | ''>('');
  const [page, setPage] = useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { showNotification } = useNotification();
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Form state
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    instrument: Instrument.GUITAR,
    description: '',
    file: null,
  });

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

  // Load books
  useEffect(() => {
    loadBooks();
  }, []);

  // Filter books when search or instrument filter changes
  useEffect(() => {
    filterBooks();
  }, [debouncedSearch, instrumentFilter, books, instrument]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data); // Cargar todos los libros primero
    } catch (error) {
      showNotification('Error al cargar los libros', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // PRIMERO: Filtrar por instrumento específico si existe
    if (instrument) {
      filtered = filtered.filter((book) => book.instrument === instrument);
    }

    // SEGUNDO: Aplicar filtro de búsqueda
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      );
    }

    // TERCERO: Aplicar filtro de instrumento manual (solo si no hay instrumento específico)
    if (instrumentFilter && !instrument) {
      filtered = filtered.filter((book) => book.instrument === instrumentFilter);
    }

    setFilteredBooks(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleUploadClick = () => {
    // Si hay un instrumento específico, preseleccionarlo
    const defaultInstrument = instrument ? instrument as Instrument : Instrument.GUITAR;
    
    setFormData({
      name: '',
      instrument: defaultInstrument,
      description: '',
      file: null,
    });
    setUploadDialogOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      name: book.name,
      instrument: book.instrument,
      description: book.description,
      file: null,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const handleViewPDF = (book: Book) => {
    setSelectedBook(book);
    setPdfViewerOpen(true);
  };

  const handleClosePDFViewer = () => {
    setPdfViewerOpen(false);
    setSelectedBook(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        showNotification('Solo se permiten archivos PDF', 'error');
        return;
      }
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        showNotification('El archivo no debe superar 50MB', 'error');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleUploadSubmit = async () => {
    if (!formData.name || !formData.file) {
      showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate progress (axios doesn't provide real progress in this setup)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await bookService.uploadBook(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      showNotification('Libro subido exitosamente', 'success');
      setUploadDialogOpen(false);
      loadBooks();
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al subir el libro',
        'error'
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedBook || !formData.name) {
      showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      await bookService.updateBook(selectedBook.id, {
        name: formData.name,
        instrument: formData.instrument,
        description: formData.description,
      });
      showNotification('Libro actualizado exitosamente', 'success');
      setEditDialogOpen(false);
      loadBooks();
    } catch (error: any) {
      showNotification(
        error.response?.data?.error || 'Error al actualizar el libro',
        'error'
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBook) return;

    try {
      await bookService.deleteBook(selectedBook.id);
      showNotification('Libro eliminado exitosamente', 'success');
      setDeleteDialogOpen(false);
      loadBooks();
    } catch (error: any) {
      console.error('Error al eliminar libro:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      
      // El error ya viene con el mensaje correcto desde el servicio
      const errorMessage = error.message || 'Error al eliminar el libro';
      
      showNotification(errorMessage, 'error');
      setDeleteDialogOpen(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1">
              Libros
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
            onClick={handleUploadClick}
          >
            Subir Libro
          </Button>
        </Box>

        {/* Search and filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar libros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* Solo mostrar filtro de instrumento si no hay uno específico */}
          {!instrument && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Instrumento</InputLabel>
              <Select
                value={instrumentFilter}
                label="Instrumento"
                onChange={(e) => setInstrumentFilter(e.target.value as Instrument | '')}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={Instrument.GUITAR}>Guitarra</MenuItem>
                <MenuItem value={Instrument.PIANO}>Piano</MenuItem>
                <MenuItem value={Instrument.BASS}>Bajo</MenuItem>
                <MenuItem value={Instrument.DRUMS}>Batería</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
        </Typography>

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Books grid */}
        {!loading && paginatedBooks.length > 0 && (
          <>
            <Grid container spacing={3}>
              {paginatedBooks.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PdfIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="div" noWrap>
                          {book.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {getInstrumentName(book.instrument)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {book.description || 'Sin descripción'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton size="small" onClick={() => handleViewPDF(book)} title="Ver PDF">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditClick(book)} title="Editar">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(book)} title="Eliminar">
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && paginatedBooks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PdfIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron libros
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {books.length === 0
                ? `Comienza subiendo tu primer libro de ${instrument ? getInstrumentName(instrument) : 'práctica'}`
                : 'Intenta ajustar los filtros de búsqueda'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Subir Nuevo Libro
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del libro"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Instrumento</InputLabel>
              <Select
                value={formData.instrument}
                label="Instrumento"
                onChange={(e) => setFormData({ ...formData, instrument: e.target.value as Instrument })}
                disabled={!!instrument} // Deshabilitar si hay un instrumento específico
              >
                <MenuItem value={Instrument.GUITAR}>Guitarra</MenuItem>
                <MenuItem value={Instrument.PIANO}>Piano</MenuItem>
                <MenuItem value={Instrument.BASS}>Bajo</MenuItem>
                <MenuItem value={Instrument.DRUMS}>Batería</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {formData.file ? formData.file.name : 'Seleccionar archivo PDF (máx. 50MB)'}
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Button>
            {uploading && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Subiendo... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleUploadSubmit} variant="contained" disabled={uploading || !formData.file}>
            Subir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Libro</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del libro"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Instrumento</InputLabel>
              <Select
                value={formData.instrument}
                label="Instrumento"
                onChange={(e) => setFormData({ ...formData, instrument: e.target.value as Instrument })}
                disabled={!!instrument} // Deshabilitar si hay un instrumento específico
              >
                <MenuItem value={Instrument.GUITAR}>Guitarra</MenuItem>
                <MenuItem value={Instrument.PIANO}>Piano</MenuItem>
                <MenuItem value={Instrument.BASS}>Bajo</MenuItem>
                <MenuItem value={Instrument.DRUMS}>Batería</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el libro "{selectedBook?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer. Se eliminarán también todos los ejercicios asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog
        open={pdfViewerOpen}
        onClose={handleClosePDFViewer}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            height: '100vh',
            m: 0,
          },
        }}
      >
        {selectedBook && (
          <PDFViewer
            fileUrl={selectedBook.fileUrl}
            onClose={handleClosePDFViewer}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default BookList;
import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitScreenIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Close as CloseIcon,
  CloudDownload as CloudDownloadIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';
import { cachePDF, isPDFCached } from '../utils/pdfCache';

// Configurar worker de PDF.js usando unpkg
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Configurar opciones de CORS para PDF.js
const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  withCredentials: false,
};

interface PDFViewerProps {
  fileUrl: string;
  onClose?: () => void;
  pageRange?: string; // Formato: "5-8" o "10" o "1,3,5"
}

// Función para parsear el rango de páginas
const parsePageRange = (range: string): number[] => {
  if (!range || range.trim() === '') return [];
  
  const pages: number[] = [];
  const parts = range.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      // Rango: "5-8"
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
    } else {
      // Página individual: "10"
      const page = parseInt(part);
      if (!isNaN(page)) {
        pages.push(page);
      }
    }
  }
  
  return [...new Set(pages)].sort((a, b) => a - b); // Eliminar duplicados y ordenar
};

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, onClose, pageRange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [allowedPages, setAllowedPages] = useState<number[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [isCaching, setIsCaching] = useState<boolean>(false);

  // Callback para medir el ancho del contenedor
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContainerWidth(node.offsetWidth);
    }
  }, []);

  // Verificar si el PDF está en caché al montar
  useEffect(() => {
    const checkCache = async () => {
      const cached = await isPDFCached(fileUrl);
      setIsCached(cached);
    };
    checkCache();
  }, [fileUrl]);

  // Parsear el rango de páginas cuando cambia
  useEffect(() => {
    if (pageRange) {
      const pages = parsePageRange(pageRange);
      setAllowedPages(pages);
      if (pages.length > 0) {
        setPageNumber(pages[0]);
        setCurrentPageIndex(0);
        setPageInputValue(pages[0].toString());
      }
    } else {
      setAllowedPages([]);
      setCurrentPageIndex(0);
    }
  }, [pageRange]);

  // Cachear el PDF automáticamente al cargarlo exitosamente
  const handleCachePDF = async () => {
    if (isCached || isCaching) {
      return;
    }

    setIsCaching(true);
    try {
      const success = await cachePDF(fileUrl);
      if (success) {
        setIsCached(true);
      }
    } catch (error) {
      console.error('Error al cachear PDF:', error);
    } finally {
      setIsCaching(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    
    // Cachear automáticamente al visualizar
    handleCachePDF();
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error al cargar PDF:', error);
    setError('No se pudo cargar el PDF. Por favor, intenta de nuevo.');
    setLoading(false);
  };

  const goToPreviousPage = () => {
    if (allowedPages.length > 0) {
      // Modo con rango de páginas
      if (currentPageIndex > 0) {
        const newIndex = currentPageIndex - 1;
        const newPage = allowedPages[newIndex];
        setCurrentPageIndex(newIndex);
        setPageNumber(newPage);
        setPageInputValue(newPage.toString());
      }
    } else {
      // Modo normal (todas las páginas)
      if (pageNumber > 1) {
        const newPage = pageNumber - 1;
        setPageNumber(newPage);
        setPageInputValue(newPage.toString());
      }
    }
  };

  const goToNextPage = () => {
    if (allowedPages.length > 0) {
      // Modo con rango de páginas
      if (currentPageIndex < allowedPages.length - 1) {
        const newIndex = currentPageIndex + 1;
        const newPage = allowedPages[newIndex];
        setCurrentPageIndex(newIndex);
        setPageNumber(newPage);
        setPageInputValue(newPage.toString());
      }
    } else {
      // Modo normal (todas las páginas)
      if (pageNumber < numPages) {
        const newPage = pageNumber + 1;
        setPageNumber(newPage);
        setPageInputValue(newPage.toString());
      }
    }
  };

  const goToPage = (page: number) => {
    if (allowedPages.length > 0) {
      // Modo con rango de páginas - solo permitir páginas del rango
      const index = allowedPages.indexOf(page);
      if (index !== -1) {
        setCurrentPageIndex(index);
        setPageNumber(page);
        setPageInputValue(page.toString());
      }
    } else {
      // Modo normal (todas las páginas)
      if (page >= 1 && page <= numPages) {
        setPageNumber(page);
        setPageInputValue(page.toString());
      }
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInputValue, 10);
      if (!isNaN(page)) {
        goToPage(page);
      } else {
        setPageInputValue(pageNumber.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page)) {
      goToPage(page);
    } else {
      setPageInputValue(pageNumber.toString());
    }
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const fitToWidth = () => {
    // Ajustar escala para que el PDF ocupe el ancho del contenedor
    // Considerando un ancho base de página PDF de ~600px
    if (containerWidth > 0) {
      const newScale = (containerWidth - 40) / 600; // 40px de padding
      setScale(Math.max(0.5, Math.min(newScale, 3.0)));
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default',
      }}
    >
      {/* Toolbar de controles - Ultra compacta */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Toolbar
          variant="dense"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 0.5,
            minHeight: 40,
            py: 0.5,
            px: 1,
          }}
        >
          {/* Indicador de caché */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCaching ? (
              <Tooltip title="Guardando para acceso offline...">
                <Chip
                  icon={<CloudDownloadIcon />}
                  label="Guardando..."
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </Tooltip>
            ) : isCached ? (
              <Tooltip title="Disponible offline">
                <Chip
                  icon={<CloudDoneIcon />}
                  label="Offline"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Tooltip>
            ) : null}
          </Box>

          {/* Controles de navegación */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={goToPreviousPage}
              disabled={
                loading || 
                (allowedPages.length > 0 ? currentPageIndex <= 0 : pageNumber <= 1)
              }
              size={isMobile ? 'small' : 'medium'}
              title="Página anterior"
            >
              <NavigateBeforeIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={pageInputValue}
                onChange={handlePageInputChange}
                onKeyPress={handlePageInputKeyPress}
                onBlur={handlePageInputBlur}
                size="small"
                disabled={loading}
                sx={{ width: isMobile ? 50 : 60 }}
                inputProps={{
                  style: { textAlign: 'center' },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {allowedPages.length > 0 
                  ? `/ ${allowedPages.length} (${allowedPages[0]}-${allowedPages[allowedPages.length - 1]})`
                  : `/ ${numPages || '?'}`
                }
              </Typography>
            </Box>

            <IconButton
              onClick={goToNextPage}
              disabled={
                loading || 
                (allowedPages.length > 0 
                  ? currentPageIndex >= allowedPages.length - 1 
                  : pageNumber >= numPages)
              }
              size={isMobile ? 'small' : 'medium'}
              title="Página siguiente"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>

          {/* Controles de zoom */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={zoomOut}
              disabled={scale <= 0.5 || loading}
              size={isMobile ? 'small' : 'medium'}
              title="Alejar"
            >
              <ZoomOutIcon />
            </IconButton>
            
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 50, textAlign: 'center' }}>
              {Math.round(scale * 100)}%
            </Typography>

            <IconButton
              onClick={zoomIn}
              disabled={scale >= 3.0 || loading}
              size={isMobile ? 'small' : 'medium'}
              title="Acercar"
            >
              <ZoomInIcon />
            </IconButton>

            <IconButton
              onClick={fitToWidth}
              disabled={loading}
              size={isMobile ? 'small' : 'medium'}
              title="Ajustar a ancho"
            >
              <FitScreenIcon />
            </IconButton>
          </Box>

          {/* Botón de cerrar */}
          {onClose && (
            <IconButton
              onClick={onClose}
              size={isMobile ? 'small' : 'medium'}
              title="Cerrar"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
      </Paper>

      {/* Área de visualización del PDF */}
      <Box
        ref={containerRef}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 0.5,
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200',
        }}
      >
        {loading && !error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Cargando PDF...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, px: 2 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error al cargar el PDF
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={handleRetry}>
              Reintentar
            </Button>
          </Box>
        )}

        {!error && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            options={pdfOptions}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              }
            />
          </Document>
        )}
      </Box>
    </Box>
  );
};

export default PDFViewer;

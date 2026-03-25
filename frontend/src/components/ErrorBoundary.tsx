import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component para capturar errores de renderizado
 * Muestra una UI de fallback sin romper toda la aplicación
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Actualizar el estado para que el siguiente renderizado muestre la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registrar el error para debugging
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    // Resetear el estado del error
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    // Recargar la página
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de fallback por defecto
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                width: '100%',
              }}
            >
              <ErrorOutline
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 2,
                }}
              />
              
              <Typography variant="h4" component="h1" gutterBottom>
                ¡Oops! Algo salió mal
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Ha ocurrido un error inesperado. No te preocupes, tus datos están seguros.
              </Typography>

              {/* Mostrar mensaje de error en desarrollo */}
              {import.meta.env.DEV && this.state.error && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    textAlign: 'left',
                    backgroundColor: 'grey.100',
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </Typography>
                </Paper>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReset}
                >
                  Intentar de nuevo
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                >
                  Recargar página
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    // Si no hay error, renderizar los children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;

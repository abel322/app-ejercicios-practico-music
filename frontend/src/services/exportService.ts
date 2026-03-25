import api from './authService';

export const exportService = {
  /**
   * Export all user data as JSON
   * Downloads a JSON file with all books, exercises, and sessions
   */
  async exportData(): Promise<void> {
    try {
      const response = await api.get('/api/export/data', {
        responseType: 'blob', // Important for file download
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/json' });
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'data-export.json';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error exporting data:', error);
      throw new Error(error.message || 'Error al exportar los datos');
    }
  },

  /**
   * Export session statistics as CSV
   * Downloads a CSV file with practice session statistics
   */
  async exportStats(): Promise<void> {
    try {
      const response = await api.get('/api/export/stats', {
        params: { format: 'csv' },
        responseType: 'blob', // Important for file download
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'practice-stats.csv';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error exporting stats:', error);
      throw new Error(error.message || 'Error al exportar las estadísticas');
    }
  },
};

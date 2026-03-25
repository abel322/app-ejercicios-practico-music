import { Response, NextFunction } from 'express';
import { ExportService } from '../services/export.service';
import { AuthRequest } from '../types';

export class ExportController {
  /**
   * Export all user data as JSON
   * GET /api/export/data
   */
  static async exportData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const data = await ExportService.exportDataJSON(req.user.userId);
      const filename = ExportService.getJSONFilename();

      // Set headers for download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export session statistics as CSV
   * GET /api/export/stats?format=csv
   */
  static async exportStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { format } = req.query;

      if (format !== 'csv') {
        res.status(400).json({ error: 'Formato no soportado. Use format=csv' });
        return;
      }

      const csvData = await ExportService.exportStatsCSV(req.user.userId);
      const filename = ExportService.getCSVFilename();

      // Set headers for download
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}

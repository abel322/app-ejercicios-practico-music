import { Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { AuthRequest } from '../types';
import { createBookSchema, updateBookSchema } from '../validation/book.validation';
import { Instrument } from '@prisma/client';

export class BookController {
  /**
   * Get all books
   * GET /api/books?search=...&instrument=...
   */
  static async getBooks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { search, instrument } = req.query;

      const books = await BookService.getBooks(req.user.userId, {
        search: search as string | undefined,
        instrument: instrument as Instrument | undefined,
      });

      res.status(200).json({ books });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single book
   * GET /api/books/:id
   */
  static async getBook(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const book = await BookService.getBook(id, req.user.userId);

      res.status(200).json({ book });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new book
   * POST /api/books
   */
  static async createBook(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'Archivo PDF es requerido' });
        return;
      }

      // Validate request body
      const validatedData = createBookSchema.parse(req.body);

      // Create book
      const book = await BookService.createBook(req.user.userId, validatedData, req.file);

      res.status(201).json({ book });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a book
   * PUT /api/books/:id
   */
  static async updateBook(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;

      // Validate request body
      const validatedData = updateBookSchema.parse(req.body);

      // Update book
      const book = await BookService.updateBook(id, req.user.userId, validatedData);

      res.status(200).json({ book });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a book
   * DELETE /api/books/:id
   */
  static async deleteBook(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const result = await BookService.deleteBook(id, req.user.userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

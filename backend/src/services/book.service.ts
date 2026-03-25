import { prisma } from '../lib/prisma';
import { StorageService } from './storage.service';
import { Instrument } from '@prisma/client';

export class BookService {
  /**
   * Get all books for a user
   */
  static async getBooks(
    userId: string,
    filters?: {
      search?: string;
      instrument?: Instrument;
    }
  ) {
    const books = await prisma.book.findMany({
      where: {
        userId,
        ...(filters?.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
        ...(filters?.instrument && { instrument: filters.instrument }),
      },
      include: {
        _count: {
          select: { exercises: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return books;
  }

  /**
   * Get a single book by ID
   */
  static async getBook(bookId: string, userId: string) {
    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        userId, // Ensure user owns the book
      },
      include: {
        exercises: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      throw new Error('Libro no encontrado');
    }

    return book;
  }

  /**
   * Create a new book
   */
  static async createBook(
    userId: string,
    data: {
      name: string;
      instrument: Instrument;
      description?: string;
    },
    file: Express.Multer.File
  ) {
    // Validate PDF
    const validation = StorageService.validatePDF(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Upload file
    const { url, key } = await StorageService.uploadPDF(file.buffer, file.originalname, userId);

    // Create book record
    const book = await prisma.book.create({
      data: {
        name: data.name,
        instrument: data.instrument,
        description: data.description || '',
        fileUrl: url,
        fileKey: key,
        userId,
      },
    });

    return book;
  }

  /**
   * Update a book
   */
  static async updateBook(
    bookId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    // Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { id: bookId, userId },
    });

    if (!existingBook) {
      throw new Error('Libro no encontrado');
    }

    // Update book
    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    return book;
  }

  /**
   * Delete a book
   */
  static async deleteBook(bookId: string, userId: string) {
    // Check if book exists and belongs to user
    const book = await prisma.book.findFirst({
      where: { id: bookId, userId },
      include: {
        exercises: {
          include: {
            _count: {
              select: { sessionExercises: true },
            },
          },
        },
      },
    });

    if (!book) {
      throw new Error('Libro no encontrado');
    }

    // Check if any exercise from this book is used in sessions
    const exercisesWithSessions = book.exercises.filter(
      (exercise) => exercise._count.sessionExercises > 0
    );

    if (exercisesWithSessions.length > 0) {
      const exerciseNames = exercisesWithSessions.map((e) => e.name).join(', ');
      const error: any = new Error(
        `No se puede eliminar el libro porque tiene ${exercisesWithSessions.length} ejercicio(s) asociado(s) a sesiones de práctica: ${exerciseNames}. Los registros históricos deben mantenerse.`
      );
      error.statusCode = 400; // Bad Request instead of 500
      throw error;
    }

    try {
      // Delete file from storage
      await StorageService.deletePDF(book.fileKey);

      // Delete book record (exercises will be cascade deleted)
      await prisma.book.delete({
        where: { id: bookId },
      });

      return { message: 'Libro eliminado exitosamente' };
    } catch (error: any) {
      // Handle any database constraint errors
      if (error.code === 'P2003') {
        const constraintError: any = new Error(
          'No se puede eliminar el libro porque sus ejercicios están siendo usados en sesiones de práctica.'
        );
        constraintError.statusCode = 400;
        throw constraintError;
      }
      throw error;
    }
  }
}

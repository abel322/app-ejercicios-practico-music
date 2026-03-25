import { translationService } from './translation.service';
import { storageService } from './storage.service';
import { prisma } from '../lib/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

interface TranslatePDFOptions {
  bookId: string;
  userId: string;
  targetLanguage: string;
  pages?: number[]; // Páginas específicas a traducir (opcional)
}

interface TranslationProgress {
  bookId: string;
  totalPages: number;
  translatedPages: number;
  status: 'processing' | 'completed' | 'failed';
  targetLanguage: string;
}

class PDFTranslationService {
  /**
   * Traduce el contenido de un libro PDF
   */
  async translateBook(options: TranslatePDFOptions): Promise<TranslationProgress> {
    const { bookId, userId, targetLanguage, pages } = options;

    // Verificar que el libro existe y pertenece al usuario
    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        userId,
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    // Extraer texto del PDF (necesitarás implementar esto con pdf-parse o similar)
    const pdfText = await this.extractTextFromPDF(book.filePath);

    // Dividir en chunks para no exceder límites de API
    const chunks = this.splitIntoChunks(pdfText, 5000);

    // Traducir chunks
    const translatedChunks = await translationService.translateBatch(
      chunks,
      { targetLanguage }
    );

    const translatedText = translatedChunks
      .map((result) => result.translatedText)
      .join('\n\n');

    // Guardar traducción en base de datos
    await prisma.bookTranslation.create({
      data: {
        bookId,
        language: targetLanguage,
        translatedContent: translatedText,
        createdAt: new Date(),
      },
    });

    return {
      bookId,
      totalPages: chunks.length,
      translatedPages: chunks.length,
      status: 'completed',
      targetLanguage,
    };
  }

  /**
   * Extrae texto de un PDF
   */
  private async extractTextFromPDF(filePath: string): Promise<string> {
    // Implementar con pdf-parse o similar
    // Por ahora retorna placeholder
    throw new Error('PDF text extraction not implemented yet');
  }

  /**
   * Divide texto en chunks manejables
   */
  private splitIntoChunks(text: string, maxChunkSize: number): string[] {
    const chunks: string[] = [];
    const paragraphs = text.split('\n\n');
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Obtiene traducción existente de un libro
   */
  async getBookTranslation(bookId: string, language: string) {
    return await prisma.bookTranslation.findFirst({
      where: {
        bookId,
        language,
      },
    });
  }

  /**
   * Lista todas las traducciones disponibles de un libro
   */
  async getAvailableTranslations(bookId: string) {
    return await prisma.bookTranslation.findMany({
      where: { bookId },
      select: {
        id: true,
        language: true,
        createdAt: true,
      },
    });
  }
}

export const pdfTranslationService = new PDFTranslationService();

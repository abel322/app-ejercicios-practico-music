import { Request, Response } from 'express';
import { translationService } from '../services/translation.service';
import { pdfTranslationService } from '../services/pdf-translation.service';

export class TranslationController {
  /**
   * POST /api/translations/translate-book
   * Traduce un libro completo
   */
  async translateBook(req: Request, res: Response) {
    try {
      const { bookId, targetLanguage, pages } = req.body;
      const userId = req.user!.id;

      if (!translationService.isConfigured()) {
        return res.status(503).json({
          error: 'Translation service not configured',
          message: 'Please configure GOOGLE_TRANSLATE_API_KEY in environment variables',
        });
      }

      const result = await pdfTranslationService.translateBook({
        bookId,
        userId,
        targetLanguage,
        pages,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Translate book error:', error);
      res.status(500).json({
        error: 'Failed to translate book',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/translations/book/:bookId
   * Obtiene traducciones disponibles de un libro
   */
  async getBookTranslations(req: Request, res: Response) {
    try {
      const { bookId } = req.params;

      const translations = await pdfTranslationService.getAvailableTranslations(bookId);

      res.json({
        success: true,
        data: translations,
      });
    } catch (error) {
      console.error('Get translations error:', error);
      res.status(500).json({
        error: 'Failed to get translations',
      });
    }
  }

  /**
   * GET /api/translations/book/:bookId/:language
   * Obtiene una traducción específica
   */
  async getTranslation(req: Request, res: Response) {
    try {
      const { bookId, language } = req.params;

      const translation = await pdfTranslationService.getBookTranslation(
        bookId,
        language
      );

      if (!translation) {
        return res.status(404).json({
          error: 'Translation not found',
        });
      }

      res.json({
        success: true,
        data: translation,
      });
    } catch (error) {
      console.error('Get translation error:', error);
      res.status(500).json({
        error: 'Failed to get translation',
      });
    }
  }

  /**
   * GET /api/translations/languages
   * Lista idiomas soportados
   */
  async getSupportedLanguages(req: Request, res: Response) {
    try {
      if (!translationService.isConfigured()) {
        return res.json({
          success: true,
          data: [],
          message: 'Translation service not configured',
        });
      }

      const languages = await translationService.getSupportedLanguages();

      res.json({
        success: true,
        data: languages,
      });
    } catch (error) {
      console.error('Get languages error:', error);
      res.status(500).json({
        error: 'Failed to get supported languages',
      });
    }
  }

  /**
   * POST /api/translations/translate-text
   * Traduce texto simple (para pruebas)
   */
  async translateText(req: Request, res: Response) {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body;

      if (!translationService.isConfigured()) {
        return res.status(503).json({
          error: 'Translation service not configured',
        });
      }

      const result = await translationService.translateText(text, {
        targetLanguage,
        sourceLanguage,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Translate text error:', error);
      res.status(500).json({
        error: 'Failed to translate text',
      });
    }
  }
}

export const translationController = new TranslationController();

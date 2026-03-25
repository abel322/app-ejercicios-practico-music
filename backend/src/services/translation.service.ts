import { Translate } from '@google-cloud/translate/build/src/v2';

interface TranslationOptions {
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

class TranslationService {
  private translate: Translate | null = null;

  constructor() {
    // Solo inicializar si hay credenciales configuradas
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      this.translate = new Translate({
        key: process.env.GOOGLE_TRANSLATE_API_KEY,
      });
    }
  }

  /**
   * Traduce un texto a un idioma específico
   */
  async translateText(
    text: string,
    options: TranslationOptions
  ): Promise<TranslationResult> {
    if (!this.translate) {
      throw new Error('Translation service not configured. Add GOOGLE_TRANSLATE_API_KEY to .env');
    }

    const { targetLanguage, sourceLanguage } = options;

    try {
      const [translation] = await this.translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage,
      });

      return {
        translatedText: translation,
        detectedSourceLanguage: sourceLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }

  /**
   * Traduce múltiples textos en batch
   */
  async translateBatch(
    texts: string[],
    options: TranslationOptions
  ): Promise<TranslationResult[]> {
    if (!this.translate) {
      throw new Error('Translation service not configured');
    }

    const { targetLanguage, sourceLanguage } = options;

    try {
      const [translations] = await this.translate.translate(texts, {
        from: sourceLanguage,
        to: targetLanguage,
      });

      return Array.isArray(translations)
        ? translations.map((text) => ({ translatedText: text }))
        : [{ translatedText: translations }];
    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error('Failed to translate texts');
    }
  }

  /**
   * Detecta el idioma de un texto
   */
  async detectLanguage(text: string): Promise<string> {
    if (!this.translate) {
      throw new Error('Translation service not configured');
    }

    try {
      const [detection] = await this.translate.detect(text);
      return Array.isArray(detection) ? detection[0].language : detection.language;
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error('Failed to detect language');
    }
  }

  /**
   * Obtiene lista de idiomas soportados
   */
  async getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
    if (!this.translate) {
      throw new Error('Translation service not configured');
    }

    try {
      const [languages] = await this.translate.getLanguages();
      return languages.map((lang) => ({
        code: lang.code,
        name: lang.name,
      }));
    } catch (error) {
      console.error('Get languages error:', error);
      throw new Error('Failed to get supported languages');
    }
  }

  /**
   * Verifica si el servicio está configurado
   */
  isConfigured(): boolean {
    return this.translate !== null;
  }
}

export const translationService = new TranslationService();

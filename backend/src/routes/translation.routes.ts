import { Router } from 'express';
import { translationController } from '../controllers/translation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Traducir libro completo
router.post('/translate-book', translationController.translateBook.bind(translationController));

// Obtener traducciones de un libro
router.get('/book/:bookId', translationController.getBookTranslations.bind(translationController));

// Obtener traducción específica
router.get('/book/:bookId/:language', translationController.getTranslation.bind(translationController));

// Listar idiomas soportados
router.get('/languages', translationController.getSupportedLanguages.bind(translationController));

// Traducir texto simple (para pruebas)
router.post('/translate-text', translationController.translateText.bind(translationController));

export default router;

import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload } from '../config/multer.config';

const router = Router();

// All book routes require authentication
router.use(authenticateToken);

/**
 * GET /api/books
 * Get all books with optional filters
 */
router.get('/', BookController.getBooks);

/**
 * POST /api/books
 * Create a new book with PDF upload
 */
router.post('/', upload.single('file'), BookController.createBook);

/**
 * GET /api/books/:id
 * Get a single book by ID
 */
router.get('/:id', BookController.getBook);

/**
 * PUT /api/books/:id
 * Update a book
 */
router.put('/:id', BookController.updateBook);

/**
 * DELETE /api/books/:id
 * Delete a book
 */
router.delete('/:id', BookController.deleteBook);

export default router;

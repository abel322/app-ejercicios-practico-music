import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Middleware to sanitize user input
 * Prevents XSS attacks by cleaning HTML/script tags
 */
export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key], {
          ALLOWED_TAGS: [], // Remove all HTML tags
          ALLOWED_ATTR: [], // Remove all attributes
        });
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = DOMPurify.sanitize(req.query[key] as string, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });
      }
    });
  }

  next();
};

import { validationResult } from 'express-validator';
import errors from '../mistakesText.js';

export const validationCheckMiddleware = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ message: errors.validationError, errors: validationErrors });
  }

  next();
};

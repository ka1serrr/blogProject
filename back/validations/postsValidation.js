import { body } from 'express-validator';
export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }),
  body('text', 'Введите текст статьи').isLength({ min: 3 }),
  body('tags', 'Укажите тэги через запятую').optional().isArray(),
  body('imageUrl', 'Невернная ссылка на изборажение').optional(),
];

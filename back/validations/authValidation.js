import { body } from 'express-validator';

export const regValidation = [
  body('email', 'Email адресс не может быть пустым').notEmpty().isEmail(),
  body('password', 'Пароль не может быть короче 4 символов').isLength({ min: 4 }),
  body('name', 'Минимум 3 символа').isLength({ min: 3 }),
  body('avatar').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Email адрес не может быть пустым').notEmpty().isEmail(),
  body('password', 'Пароль не может быть короче 4 символов').isLength({ min: 4 }),
];

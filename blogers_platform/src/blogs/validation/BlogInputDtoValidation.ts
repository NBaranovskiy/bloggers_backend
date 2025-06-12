import { body, param, validationResult,ValidationError  } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { bloggersRepository } from '../../blogs/repositories/bloggers.repository';
// import { BlogInputDto } from '../dto/blog.input-dto'; // Если нужна сама DTO для типизации, но для валидации она не обязательна

// Определение паттерна для URL (или можно использовать встроенный isURL от express-validator)
const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

// --- Валидаторы ---

// Валидация для полей BlogInputDto (для тела запроса POST/PUT)
export const blogInputValidation = [
  body('name')
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Name must be between 2 and 15 characters long'),

  body('description')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Description must be between 2 and 500 characters long'),

  body('websiteUrl')
    .exists()
    .withMessage('Website URL is required')
    .isString()
    .withMessage('Website URL must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Website URL must be between 2 and 100 characters long')
    .matches(websiteUrlPattern)
    .withMessage('Invalid Website URL format'),
];

// Валидация для параметра ID (для запросов GET/PUT/DELETE по ID)
export const mongoIdValidation = [
  param('id')
    .exists()
    .withMessage('Blog ID is required')
    .isString()
    .withMessage('Blog ID must be a string')
    .isMongoId() // Проверяет, является ли строка корректным MongoDB ObjectId
    .withMessage('Incorrect format of Blog ID')
    .custom(async (id: string, { req }) => {
      // Эта кастомная валидация выполняется только если ID уже прошел проверку isMongoId()
      const blog = await bloggersRepository.findById(id);
      if (!blog) {
        throw new Error('Blog not found'); // Сообщение об ошибке, если блог не существует
      }
    }),
];

// --- Обработчик ошибок валидации ---

/**
 * Middleware для обработки результатов валидации express-validator.
 * Если есть ошибки, отправляет ответ со статусом 400 и отформатированными ошибками.
 */

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // LAST RESORT: Cast to 'any' if 'param' and 'path' are both not recognized
    const formattedErrors = errors.array().map((error: any) => {
      const field = error.param || error.path || ''; // Try both, fallback to empty
      return {
        message: error.msg,
        field: field
      };

    });
    res.status(400).json({ errorsMessages: formattedErrors });
    return;
  }
  return next();
};
// --- Объединение в один пакет для экспорта (опционально, но удобно) ---

// Если вы хотите экспортировать всё из одного места, можно сделать так:
export const validationMiddleware = {
  blogInputValidation,
  mongoIdValidation,
  handleValidationErrors,
};


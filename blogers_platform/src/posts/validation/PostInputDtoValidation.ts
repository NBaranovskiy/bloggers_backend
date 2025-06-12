import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
// ObjectId больше не нужен здесь, так как isMongoId() обрабатывает формат
// import { ObjectId } from 'mongodb'; // <-- Можно удалить, если не используется явно

// --- ИМПОРТИРУЕМ РЕПОЗИТОРИИ ДЛЯ ПРОВЕРОК СУЩЕСТВОВАНИЯ ---
import { bloggersRepository } from '../../blogs/repositories/bloggers.repository'; // Для проверки blogId
// postsRepository здесь не нужен для валидации, если вы не валидируете POST ID в теле запроса
// import { postsRepository } from '../posts/posts.repository';
// --- КОНЕЦ ИМПОРТА РЕПОЗИТОРИЕВ ---

// (Ваши существующие паттерны, если есть)
const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

// --- Валидаторы ---

// Валидация для полей BlogInputDto (остаётся без изменений)
export const blogInputValidation = [
  body('name')
    .exists()
    .withMessage('Name is required').bail()
    .isString()
    .withMessage('Name must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Name must be between 2 and 15 characters long').bail(),

  body('description')
    .exists()
    .withMessage('Description is required').bail()
    .isString()
    .withMessage('Description must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Description must be between 2 and 500 characters long').bail(),

  body('websiteUrl')
    .exists()
    .withMessage('Website URL is required').bail()
    .isString()
    .withMessage('Website URL must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Website URL must be between 2 and 100 characters long').bail()
    .matches(websiteUrlPattern)
    .withMessage('Invalid Website URL format').bail(),
];

// Валидация для полей PostInputDto (остаётся без изменений, т.к. rely on isMongoId and repository)
export const postInputValidation = [
  body('title')
    .exists()
    .withMessage('Title is required').bail()
    .isString()
    .withMessage('Title must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Title must be between 2 and 30 characters long').bail(),

  body('shortDescription')
    .exists()
    .withMessage('Short description is required').bail()
    .isString()
    .withMessage('Short description must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Short description must be between 2 and 100 characters long').bail(),

  body('content')
    .exists()
    .withMessage('Content is required').bail()
    .isString()
    .withMessage('Content must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Content must be between 2 and 1000 characters long').bail(),

  body('blogId')
    .exists()
    .withMessage('Blog ID is required').bail()
    .isString()
    .withMessage('Blog ID must be a string').bail()
    .trim()
    .isMongoId()
    .withMessage('Blog ID must be a valid MongoDB ObjectId').bail()
    .custom(async (blogId: string) => {
      try {
        const blogExists = await bloggersRepository.findById(blogId);
        if (!blogExists) {
          throw new Error('Blog with the provided ID does not exist.');
        }
      } catch (e: any) {
        // Ловим ошибки, если репозиторий выбросил что-то непредвиденное,
        // но формат ID уже проверен isMongoId().
        throw new Error('Failed to validate Blog ID due to an internal issue.');
      }
    }),
];

// Валидация для параметра ID (остаётся без изменений)
export const mongoIdValidation = [
  param('id')
    .exists()
    .withMessage('ID is required').bail()
    .isString()
    .withMessage('ID must be a string').bail()
    .isMongoId() // Проверяет, является ли строка корректным MongoDB ObjectId
    .withMessage('Incorrect format of ObjectId').bail(),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: any) => { // Используем 'any' для гибкости
      // Пробуем error.param, затем error.path, иначе пустая строка.
      // Это обеспечивает максимальную совместимость с различными версиями express-validator
      // и тестовыми окружениями.
      const field = error.param || error.path || '';
      return {
        message: error.msg,
        field: field
      };
    });

    // Отправляем ответ со статусом 400 и ошибками валидации
    // и завершаем обработку запроса, чтобы избежать вызова next()
    res.status(400).json({ errorsMessages: formattedErrors });
    return;
  }

  // Если ошибок нет, передаём управление следующему middleware
  return next();
};
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

// Валидация для полей PostInputDto (остаётся без изменений, т.к. rely on isMongoId and repository)
export const postInputValidation = [
  body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Title must be between 2 and 30 characters long'),

  body('shortDescription')
    .exists()
    .withMessage('Short description is required')
    .isString()
    .withMessage('Short description must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Short description must be between 2 and 100 characters long'),

  body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Content must be between 2 and 1000 characters long'),

  body('blogId')
    .exists()
    .withMessage('Blog ID is required')
    .isString()
    .withMessage('Blog ID must be a string')
    .trim()
    .isMongoId()
    .withMessage('Blog ID must be a valid MongoDB ObjectId')
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
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isMongoId() // Проверяет, является ли строка корректным MongoDB ObjectId
    .withMessage('Incorrect format of ObjectId'),
];

// Обработчик ошибок валидации
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: any) => { // 'any' для обхода ошибки типизации 'path'
      const field = error.path || '';

      return {
        message: error.msg,
        field: field
      };
    });

    // **** ИСПРАВЛЕНИЕ: ВОССТАНАВЛИВАЕМ ОТПРАВКУ ОТВЕТА И return ****
    res.status(400).json({ errorsMessages: formattedErrors });
    return; // Завершаем выполнение middleware
  }
  return next(); // Передаем управление следующему middleware
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = exports.handleValidationErrors = exports.mongoIdValidation = exports.blogInputValidation = void 0;
const express_validator_1 = require("express-validator");
// import { bloggersRepository } from '../../blogs/repositories/bloggers.repository'; // Не используется в этом файле
// import { BlogInputDto } from '../dto/blog.input-dto'; // Если нужна сама DTO для типизации, но для валидации она не обязательна
// Определение паттерна для URL (или можно использовать встроенный isURL от express-validator)
const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
// --- Валидаторы ---
// Валидация для полей BlogInputDto (для тела запроса POST/PUT)
exports.blogInputValidation = [
    (0, express_validator_1.body)('name')
        .exists()
        .withMessage('Name is required').bail()
        .isString()
        .withMessage('Name must be a string').bail()
        .trim()
        .isLength({ min: 2, max: 15 })
        .withMessage('Name must be between 2 and 15 characters long').bail(),
    (0, express_validator_1.body)('description')
        .exists()
        .withMessage('Description is required').bail()
        .isString()
        .withMessage('Description must be a string').bail()
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage('Description must be between 2 and 500 characters long').bail(),
    (0, express_validator_1.body)('websiteUrl')
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
// Валидация для параметра ID (для запросов GET/PUT/DELETE по ID)
exports.mongoIdValidation = [
    (0, express_validator_1.param)('id')
        .exists()
        .withMessage('Blog ID is required').bail()
        .isString()
        .withMessage('Blog ID must be a string').bail()
        .isMongoId() // Проверяет, является ли строка корректным MongoDB ObjectId
        .withMessage('Incorrect format of Blog ID').bail()
];
// --- Обработчик ошибок валидации ---
/**
 * Middleware для обработки результатов валидации express-validator.
 * Если есть ошибки, отправляет ответ со статусом 400 и отформатированными ошибками.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
            // Используем 'path' как более универсальное поле, если 'param' не всегда доступен
            const field = error.path || error.param || '';
            return {
                message: error.msg,
                field: field
            };
        });
        // ИЗМЕНЕНИЕ ЗДЕСЬ: Возвращаем 400 (Bad Request) вместо 404
        res.status(400).json({ errorsMessages: formattedErrors });
        return; // Важно вернуть, чтобы остановить выполнение запроса
    }
    return next(); // Если ошибок нет, передаем управление следующему middleware/обработчику
};
exports.handleValidationErrors = handleValidationErrors;
// --- Объединение в один пакет для экспорта (опционально, но удобно) ---
exports.validationMiddleware = {
    blogInputValidation: exports.blogInputValidation,
    mongoIdValidation: exports.mongoIdValidation,
    handleValidationErrors: exports.handleValidationErrors,
};

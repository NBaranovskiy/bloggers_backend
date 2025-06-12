"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = exports.handleValidationErrors = exports.mongoIdValidation = exports.blogInputValidation = void 0;
const express_validator_1 = require("express-validator");
const bloggers_repository_1 = require("../../blogs/repositories/bloggers.repository");
// import { BlogInputDto } from '../dto/blog.input-dto'; // Если нужна сама DTO для типизации, но для валидации она не обязательна
// Определение паттерна для URL (или можно использовать встроенный isURL от express-validator)
const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
// --- Валидаторы ---
// Валидация для полей BlogInputDto (для тела запроса POST/PUT)
exports.blogInputValidation = [
    (0, express_validator_1.body)('name')
        .exists().bail()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: 2, max: 15 })
        .withMessage('Name must be between 2 and 15 characters long'),
    (0, express_validator_1.body)('description')
        .exists().bail()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage('Description must be between 2 and 500 characters long'),
    (0, express_validator_1.body)('websiteUrl')
        .exists().bail()
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
exports.mongoIdValidation = [
    (0, express_validator_1.param)('id')
        .exists().bail()
        .withMessage('Blog ID is required')
        .isString()
        .withMessage('Blog ID must be a string')
        .isMongoId() // Проверяет, является ли строка корректным MongoDB ObjectId
        .withMessage('Incorrect format of Blog ID')
        .custom((id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { req }) {
        // Эта кастомная валидация выполняется только если ID уже прошел проверку isMongoId()
        const blog = yield bloggers_repository_1.bloggersRepository.findById(id);
        if (!blog) {
            throw new Error('Blog not found'); // Сообщение об ошибке, если блог не существует
        }
    })),
];
// --- Обработчик ошибок валидации ---
/**
 * Middleware для обработки результатов валидации express-validator.
 * Если есть ошибки, отправляет ответ со статусом 400 и отформатированными ошибками.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // LAST RESORT: Cast to 'any' if 'param' and 'path' are both not recognized
        const formattedErrors = errors.array().map((error) => {
            const field = error.param || error.path || ''; // Try both, fallback to empty
            return {
                message: error.msg,
                field: field
            };
        });
        res.status(404).json({ errorsMessages: formattedErrors });
        return;
    }
    return next();
};
exports.handleValidationErrors = handleValidationErrors;
// --- Объединение в один пакет для экспорта (опционально, но удобно) ---
// Если вы хотите экспортировать всё из одного места, можно сделать так:
exports.validationMiddleware = {
    blogInputValidation: exports.blogInputValidation,
    mongoIdValidation: exports.mongoIdValidation,
    handleValidationErrors: exports.handleValidationErrors,
};

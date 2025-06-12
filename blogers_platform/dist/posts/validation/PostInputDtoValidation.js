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
exports.handleValidationErrors = exports.mongoIdValidation = exports.postInputValidation = exports.blogInputValidation = void 0;
const express_validator_1 = require("express-validator");
// ObjectId больше не нужен здесь, так как isMongoId() обрабатывает формат
// import { ObjectId } from 'mongodb'; // <-- Можно удалить, если не используется явно
// --- ИМПОРТИРУЕМ РЕПОЗИТОРИИ ДЛЯ ПРОВЕРОК СУЩЕСТВОВАНИЯ ---
const bloggers_repository_1 = require("../../blogs/repositories/bloggers.repository"); // Для проверки blogId
// postsRepository здесь не нужен для валидации, если вы не валидируете POST ID в теле запроса
// import { postsRepository } from '../posts/posts.repository';
// --- КОНЕЦ ИМПОРТА РЕПОЗИТОРИЕВ ---
// (Ваши существующие паттерны, если есть)
const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
// --- Валидаторы ---
// Валидация для полей BlogInputDto (остаётся без изменений)
exports.blogInputValidation = [
    (0, express_validator_1.body)('name')
        .exists()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: 2, max: 15 })
        .withMessage('Name must be between 2 and 15 characters long'),
    (0, express_validator_1.body)('description')
        .exists()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage('Description must be between 2 and 500 characters long'),
    (0, express_validator_1.body)('websiteUrl')
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
exports.postInputValidation = [
    (0, express_validator_1.body)('title')
        .exists()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Title must be between 2 and 30 characters long'),
    (0, express_validator_1.body)('shortDescription')
        .exists()
        .withMessage('Short description is required')
        .isString()
        .withMessage('Short description must be a string')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Short description must be between 2 and 100 characters long'),
    (0, express_validator_1.body)('content')
        .exists()
        .withMessage('Content is required')
        .isString()
        .withMessage('Content must be a string')
        .trim()
        .isLength({ min: 2, max: 1000 })
        .withMessage('Content must be between 2 and 1000 characters long'),
    (0, express_validator_1.body)('blogId')
        .exists()
        .withMessage('Blog ID is required')
        .isString()
        .withMessage('Blog ID must be a string')
        .trim()
        .isMongoId()
        .withMessage('Blog ID must be a valid MongoDB ObjectId')
        .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogExists = yield bloggers_repository_1.bloggersRepository.findById(blogId);
            if (!blogExists) {
                throw new Error('Blog with the provided ID does not exist.');
            }
        }
        catch (e) {
            // Ловим ошибки, если репозиторий выбросил что-то непредвиденное,
            // но формат ID уже проверен isMongoId().
            throw new Error('Failed to validate Blog ID due to an internal issue.');
        }
    })),
];
// Валидация для параметра ID (остаётся без изменений)
exports.mongoIdValidation = [
    (0, express_validator_1.param)('id')
        .exists()
        .withMessage('ID is required')
        .isString()
        .withMessage('ID must be a string')
        .isMongoId() // Проверяет, является ли строка корректным MongoDB ObjectId
        .withMessage('Incorrect format of ObjectId'),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
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
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    // Если ошибок нет, передаём управление следующему middleware
    return next();
};
exports.handleValidationErrors = handleValidationErrors;

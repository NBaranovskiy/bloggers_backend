import { Router } from 'express';
import { getPostsListHandler } from './handlers/getPostsListHandler';
import { createPostHandler } from './handlers/createPostHandler';
import { getByIdPost } from './handlers/getByIdPost';
import { updatePostHandler } from './handlers/updatePostHandler';
import { deletePostHandler } from './handlers/deletePostHandler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

// Импортируем наши валидаторы и обработчик ошибок
import {
    postInputValidation,    // Для валидации тела запроса при создании/обновлении поста
    mongoIdValidation,      // Для валидации ID в параметрах URL
    handleValidationErrors  // Для обработки ошибок валидации
} from '../validation/PostInputDtoValidation'; // Убедитесь, что путь к файлу верен

export const postsRouter = Router({});

postsRouter
    .get(
        '',
        getPostsListHandler // Для получения всех постов валидация не требуется
    )
    .post(
        '',
        superAdminGuardMiddleware, // Проверка авторизации
        postInputValidation,       // **Валидация тела запроса для создания поста**
        handleValidationErrors,    // **Обработка ошибок валидации**
        createPostHandler          // Ваш основной хендлер
    )
    .get(
        '/:id',
        mongoIdValidation,         // **Валидация ID поста в параметрах URL**
        handleValidationErrors,    // **Обработка ошибок валидации**
        getByIdPost                // Ваш основной хендлер
    )
    .put(
        '/:id',
        superAdminGuardMiddleware, // Проверка авторизации
        mongoIdValidation,         // **Валидация ID поста в параметрах URL**
        postInputValidation,       // **Валидация тела запроса для обновления поста**
        handleValidationErrors,    // **Обработка ошибок валидации**
        updatePostHandler          // Ваш основной хендлер
    )
    .delete(
        '/:id',
        superAdminGuardMiddleware, // Проверка авторизации
        mongoIdValidation,         // **Валидация ID поста в параметрах URL**
        handleValidationErrors,    // **Обработка ошибок валидации**
        deletePostHandler          // Ваш основной хендлер
    );
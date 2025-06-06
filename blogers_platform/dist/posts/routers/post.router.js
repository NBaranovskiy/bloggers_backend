"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const getPostsListHandler_1 = require("./handlers/getPostsListHandler");
const createPostHandler_1 = require("./handlers/createPostHandler");
const getByIdPost_1 = require("./handlers/getByIdPost");
const updatePostHandler_1 = require("./handlers/updatePostHandler");
const deletePostHandler_1 = require("./handlers/deletePostHandler");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
// Импортируем наши валидаторы и обработчик ошибок
const PostInputDtoValidation_1 = require("../validation/PostInputDtoValidation"); // Убедитесь, что путь к файлу верен
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('', getPostsListHandler_1.getPostsListHandler // Для получения всех постов валидация не требуется
)
    .post('', super_admin_guard_middleware_1.superAdminGuardMiddleware, // Проверка авторизации
PostInputDtoValidation_1.postInputValidation, // **Валидация тела запроса для создания поста**
PostInputDtoValidation_1.handleValidationErrors, // **Обработка ошибок валидации**
createPostHandler_1.createPostHandler // Ваш основной хендлер
)
    .get('/:id', PostInputDtoValidation_1.mongoIdValidation, // **Валидация ID поста в параметрах URL**
PostInputDtoValidation_1.handleValidationErrors, // **Обработка ошибок валидации**
getByIdPost_1.getByIdPost // Ваш основной хендлер
)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, // Проверка авторизации
PostInputDtoValidation_1.mongoIdValidation, // **Валидация ID поста в параметрах URL**
PostInputDtoValidation_1.postInputValidation, // **Валидация тела запроса для обновления поста**
PostInputDtoValidation_1.handleValidationErrors, // **Обработка ошибок валидации**
updatePostHandler_1.updatePostHandler // Ваш основной хендлер
)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, // Проверка авторизации
PostInputDtoValidation_1.mongoIdValidation, // **Валидация ID поста в параметрах URL**
PostInputDtoValidation_1.handleValidationErrors, // **Обработка ошибок валидации**
deletePostHandler_1.deletePostHandler // Ваш основной хендлер
);

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
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('', getPostsListHandler_1.getPostsListHandler)
    .post('', super_admin_guard_middleware_1.superAdminGuardMiddleware, createPostHandler_1.createPostHandler)
    .get('/:id', getByIdPost_1.getByIdPost)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, updatePostHandler_1.updatePostHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, deletePostHandler_1.deletePostHandler);

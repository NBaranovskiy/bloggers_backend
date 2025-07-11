"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const getByIdBlogger_1 = require("./handlers/getByIdBlogger");
const getBlogsListHandler_1 = require("./handlers/getBlogsListHandler");
const createBlogHandler_1 = require("./handlers/createBlogHandler");
const updateBloggerHandler_1 = require("./handlers/updateBloggerHandler");
const deleteBloggerHandler_1 = require("./handlers/deleteBloggerHandler");
const createPostForBlogHandler_1 = require("./handlers/createPostForBlogHandler");
const super_admin_guard_middleware_1 = require("../../auth/middlewares/super-admin.guard-middleware");
// Import your validation middleware
const BlogInputDtoValidation_1 = require("../validation/BlogInputDtoValidation");
const getPostsByIdBlogHandler_1 = require("./handlers/getPostsByIdBlogHandler");
const PostInputDtoValidation_1 = require("../../posts/validation/PostInputDtoValidation"); // Adjust the path as needed
exports.blogRouter = (0, express_1.Router)({});
exports.blogRouter
    .get('', getBlogsListHandler_1.getBlogsListHandler) // No validation needed for getting all blogs
    .post('', super_admin_guard_middleware_1.superAdminGuardMiddleware, BlogInputDtoValidation_1.blogInputValidation, // Apply input validation for the request body
BlogInputDtoValidation_1.handleValidationErrors, // Handle any validation errors
createBlogHandler_1.createBlogHandler)
    .get('/:blogId/posts', BlogInputDtoValidation_1.mongoIdValidation, BlogInputDtoValidation_1.handleValidationErrors, getPostsByIdBlogHandler_1.getPostsByIdBlogHandler)
    .post('/:blogId/posts', super_admin_guard_middleware_1.superAdminGuardMiddleware, PostInputDtoValidation_1.postInputValidation, createPostForBlogHandler_1.createPostForBlogHandler)
    .get('/:id', BlogInputDtoValidation_1.mongoIdValidation, // Apply validation for the 'id' parameter
BlogInputDtoValidation_1.handleValidationErrors, // Handle any validation errors
getByIdBlogger_1.getByIdBlogger)
    .put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, BlogInputDtoValidation_1.mongoIdValidation, // Validate the 'id' parameter first
BlogInputDtoValidation_1.blogInputValidation, // Then validate the request body
BlogInputDtoValidation_1.handleValidationErrors, // Handle any validation errors
updateBloggerHandler_1.updateBloggerHandler)
    .delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, BlogInputDtoValidation_1.mongoIdValidation, // Validate the 'id' parameter
BlogInputDtoValidation_1.handleValidationErrors, // Handle any validation errors
deleteBloggerHandler_1.deleteBloggerHandler);

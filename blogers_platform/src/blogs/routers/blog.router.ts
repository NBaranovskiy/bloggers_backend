import { Router,Response,Request } from 'express';
import { getByIdBlogger } from "./handlers/getByIdBlogger";
import { getBlogsListHandler } from "./handlers/getBlogsListHandler";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBloggerHandler } from "./handlers/updateBloggerHandler";
import { deleteBloggerHandler } from "./handlers/deleteBloggerHandler";
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

// Import your validation middleware
import {
    blogInputValidation,
    mongoIdValidation,
    handleValidationErrors
} from '../validation/BlogInputDtoValidation';
import {createPostHandler} from "../../posts/routers/handlers/createPostHandler";
import {getByIdBloggerForPosts} from "./handlers/getByIdBloggerForPosts"; // Adjust the path as needed

export const blogRouter = Router({});

blogRouter
    .get('', getBlogsListHandler) // No validation needed for getting all blogs

    .post(
        '',
        superAdminGuardMiddleware,
        blogInputValidation, // Apply input validation for the request body
        handleValidationErrors, // Handle any validation errors
        createBlogHandler
    )

    .get(
        '/:id',
        mongoIdValidation, // Apply validation for the 'id' parameter
        handleValidationErrors, // Handle any validation errors
        getByIdBlogger
    )

    .put(
        '/:id',
        superAdminGuardMiddleware,
        mongoIdValidation, // Validate the 'id' parameter first
        blogInputValidation, // Then validate the request body
        handleValidationErrors, // Handle any validation errors
        updateBloggerHandler
    )

    .delete(
        '/:id',
        superAdminGuardMiddleware,
        mongoIdValidation, // Validate the 'id' parameter
        handleValidationErrors, // Handle any validation errors
        deleteBloggerHandler
    )
    .post(
        '/:id/posts',
        superAdminGuardMiddleware,
        blogInputValidation, // Apply input validation for the request body
        handleValidationErrors, // Handle any validation errors
        createPostHandler
    )
    .get(
        '/:id/posts',
        mongoIdValidation, // Apply validation for the 'id' parameter
        handleValidationErrors, // Handle any validation errors
        getByIdBloggerForPosts
    );
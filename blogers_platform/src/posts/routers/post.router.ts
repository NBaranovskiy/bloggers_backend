import { Router } from 'express';
import {getPostsListHandler} from "./handlers/getPostsListHandler"
import {createPostHandler} from "./handlers/createPostHandler";
import {getByIdPost} from "./handlers/getByIdPost";
import {updatePostHandler} from "./handlers/updatePostHandler";
import {deletePostHandler} from "./handlers/deletePostHandler"
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const postsRouter = Router({});

postsRouter
    .get('', getPostsListHandler)
    .post('', superAdminGuardMiddleware,createPostHandler)
    .get('/:id',getByIdPost)
    .put('/:id',superAdminGuardMiddleware,updatePostHandler)
    .delete('/:id',superAdminGuardMiddleware,deletePostHandler)
import { Router } from 'express';
import {getByIdBlogger} from "./handlers/getByIdBlogger"
import {getBlogsListHandler} from "./handlers/getBlogsListHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {updateBloggerHandler} from "./handlers/updateBloggerHandler";
import {deleteBloggerHandler} from "./handlers/deleteBloggerHandler"
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const blogRouter = Router({});

blogRouter
    .get('', getBlogsListHandler)
    .post('', superAdminGuardMiddleware,createBlogHandler)
    .get('/:id',getByIdBlogger)
    .put('/:id',superAdminGuardMiddleware,updateBloggerHandler)
    .delete('/:id',superAdminGuardMiddleware,deleteBloggerHandler)
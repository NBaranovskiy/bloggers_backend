import { Router } from 'express';
import {getByIdBlogger} from "./handlers/getByIdBlogger"
import {getBlogsListHandler} from "./handlers/getBlogsListHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {updateBloggerHandler} from "./handlers/updateBloggerHandler";
import {deleteBloggerHandler} from "./handlers/deleteBloggerHandler"

export const blogRouter = Router({});

blogRouter
    .get('', getBlogsListHandler)
    .post('', createBlogHandler)
    .get('/:id',getByIdBlogger)
    .put('/:id',updateBloggerHandler)
    .delete('/:id',deleteBloggerHandler)
import { Router } from 'express';
import {getPostsListHandler} from "./handlers/getPostsListHandler"
import {createPostHandler} from "./handlers/createPostHandler";
import {getByIdPost} from "./handlers/getByIdPost";
import {updatePostHandler} from "./handlers/updatePostHandler";
import {deletePostHandler} from "./handlers/deletePostHandler"

export const postsRouter = Router({});

postsRouter
    .get('', getPostsListHandler)
    .post('', createPostHandler)
    .get('/:id',getByIdPost)
    .put('/:id',updatePostHandler)
    .delete('/:id',deletePostHandler)
import { Request, Response } from 'express';
import {PostInputDto} from "../../dto/post.input-dto";
import {db} from "../../../db/in-memory.db";
import {PostInputDtoValidation} from "../../validation/PostInputDtoValidation";
import {createErrorMessages} from "../../../core/utils/error.utils"




export function updatePostHandler(
    req: Request<{id:string},{},PostInputDto>,
    res: Response
) {
    const id = req.params.id;
    const index = db.posts.findIndex(d => d.id === id);

    if (index === -1) {
        res.status(404).send(createErrorMessages([{field: 'id', message: 'Post not found'}]));
        return;
    }

    const errors = PostInputDtoValidation(req.body);

    if (errors.length > 0) {
        res.status(400).send(createErrorMessages(errors));
        return;
    }

    const Post = db.posts[index];

    Post.title = req.body.title;
    Post.shortDescription = req.body.shortDescription;
    Post.content = req.body.content;
    Post.blogId = req.body.blogId;
    Post.blogName = db.bloggers[db.bloggers.findIndex(d => d.id === req.body.blogId)].name

    res.sendStatus(204);

};
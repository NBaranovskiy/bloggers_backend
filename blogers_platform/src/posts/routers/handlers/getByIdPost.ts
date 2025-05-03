
import { Request, Response } from 'express';
import {db} from "../../../db/in-memory.db";
import {createErrorMessages} from "../../../core/utils/error.utils"


export function getByIdPost(
    req: Request,
    res: Response
) {
    const id = req.params.id;
    const post = db.posts.find(d =>d.id === id);

    if (!post){
       res.status(404).send(createErrorMessages([{ field: 'id', message: 'Post not found' }]),);
        return;
    }

    res.status(200).send(post)

}
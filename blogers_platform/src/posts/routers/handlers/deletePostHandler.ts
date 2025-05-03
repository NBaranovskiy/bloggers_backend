import { Request, Response } from 'express';
import {db} from "../../../db/in-memory.db";
import {createErrorMessages} from "../../../core/utils/error.utils";

export function deletePostHandler(
    req:Request,
    res:Response
){
    const id = req.params.id;
    const index = db.posts.findIndex(d => d.id === id);

    if (index === -1){
        res.status(404).send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
        return;
    };
    db.posts.splice(index,1);
    res.sendStatus(204);
};
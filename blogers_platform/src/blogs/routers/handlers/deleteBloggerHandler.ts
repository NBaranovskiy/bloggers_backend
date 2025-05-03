import { Request, Response } from 'express';
import {db} from "../../../db/in-memory.db";
import {createErrorMessages} from "../../../core/utils/error.utils";
export function deleteBloggerHandler(
    req:Request,
    res:Response
){
    const id = req.params.id;
    const index = db.bloggers.findIndex(d => d.id === id);

    if (index === -1){
        res.status(404).send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
        return;
    };
    db.bloggers.splice(index,1);
    res.sendStatus(204);
};
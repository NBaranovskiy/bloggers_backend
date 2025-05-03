
import { Request, Response } from 'express';
import {db} from "../../../db/in-memory.db";
import {createErrorMessages} from "../../../core/utils/error.utils"


export function getByIdBlogger(
    req: Request,
    res: Response
) {
    const id = req.params.id;
    const blogger = db.bloggers.find(d =>d.id === id);

    if (!blogger){
       res.status(404).send(createErrorMessages([{ field: 'id', message: 'Driver not found' }]),);
        return;
    }

    res.status(200).send(blogger)

}
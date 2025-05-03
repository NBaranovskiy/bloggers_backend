import { Request, Response } from 'express';
import {BlogInputDto} from "../../dto/blog.input-dto";
import {db} from "../../../db/in-memory.db";
import {BlogInputDtoValidation} from "../../validation/BlogInputDtoValidation";
import {createErrorMessages} from "../../../core/utils/error.utils"
import {Blogger} from "../../types/blogger";



export function updateBloggerHandler(
    req: Request<{id:string},{},BlogInputDto>,
    res: Response
) {
    const id = req.params.id;
    const index = db.bloggers.findIndex(d => d.id === id);

    if (index === -1){
        res.status(404).send(createErrorMessages([{ field: 'id', message: 'blog not found' }]));
        return;
    }

    const errors = BlogInputDtoValidation(req.body);

    if (errors.length > 0) {
        res.status(400).send(createErrorMessages(errors));
        return;
    }

    const blogger = db.bloggers[index];

    blogger.name = req.body.name;
    blogger.description = req.body.description;
    blogger.websiteUrl = req.body.websiteUrl;

    res.sendStatus(204)

}
// src/routers/handlers/deleteBloggerHandler.ts

import { Request, Response } from 'express';
import { bloggersRepository } from '../../repositories/bloggers.repository';

// We no longer need the in-memory database or createErrorMessages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils";

export const deleteBloggerHandler = async ( // Make the function async
    req: Request<{id: string}>, // Type req.params.id for clarity
    res: Response
) => {

    const blogId = req.params.id;

    const isDeleted = await bloggersRepository.delete(blogId); // Получаем boolean

    if (!isDeleted) {
        res.status(404); // Пост не найден
        return;
    }
    res.status(204); // Успешно удалено
    return;


};
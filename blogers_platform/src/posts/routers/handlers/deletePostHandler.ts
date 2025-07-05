import { Request, Response } from 'express';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import {postsServices} from "../../application/posts.services"; // <-- Check this path carefully

export const deletePostHandler = async (
    req: Request<{id: string}>,
    res: Response
) => {
    const postId = req.params.id;

    const isDeleted = await postsServices.delete(postId); // Получаем boolean

    if (!isDeleted) {

        res.sendStatus(404); // Пост не найден
        return;
    }
    res.sendStatus(204); // Успешно удалено
    return;
};
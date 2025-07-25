// src/routers/handlers/getByIdBlogger.ts

import { Request, Response } from 'express';
import {bloggersRepository} from "../../repositories/bloggers.repository";
import {postsRepository} from "../../../posts/repositories/posts.repository";

export const getByIdBloggerForPosts = async (
    // Типизируем параметры запроса для ID блогера и добавляем параметры запроса для пагинации
    req: Request<{ id: string }, {}, {}, { pageNumber?: string; pageSize?: string }>,
    res: Response
) => {
    const bloggerId = req.params.id; // ID блогера из URL

    // Получаем pageNumber из запроса, по умолчанию 1
    const pageNumber = parseInt(req.query.pageNumber || '1', 10);
    // Получаем pageSize из запроса, по умолчанию 10
    const pageSize = parseInt(req.query.pageSize || '10', 10);

    // Проверяем, существует ли блогер
    const blogger = await bloggersRepository.findById(bloggerId);

    if (!blogger) {
        // Если блогер не найден, отправляем 404
        res.sendStatus(404);
        return;
    }

    try {
        // Получаем пагинированные посты для данного блогера
        const { posts, totalCount } = await postsRepository.findPostsByBloggerId(
            bloggerId,
            pageNumber,
            pageSize
        );

        // Формируем объект ответа с информацией о пагинации и списком постов
        res.status(200).json({
            pagesCount: Math.ceil(totalCount / pageSize), // Общее количество страниц
            page: pageNumber, // Текущая страница
            pageSize: pageSize, // Размер страницы
            totalCount: totalCount, // Общее количество постов
            items: posts, // Массив постов для текущей страницы
        });
    } catch (error) {
        console.error('Error fetching posts for blogger:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
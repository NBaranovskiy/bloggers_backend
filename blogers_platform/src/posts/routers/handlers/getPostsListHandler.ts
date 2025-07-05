import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import {Paged, PostsQueryDto} from "../../dto/post.input-dto";
import {Post} from "../../types/post";
import {postsServices} from "../../application/posts.services";

export const getPostsListHandler = async (
    req: Request<{}, {}, {}, PostsQueryDto>, // Типизируем req.query
    res: Response<Paged<Post> | { message: string }> // Типизируем ответ
) => { // Make the function async
    const queryDto: PostsQueryDto = {
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        searchContentTerm: req.query.searchContentTerm ? String(req.query.searchContentTerm) : undefined,
        blogId: req.query.blogId ? String(req.query.blogId) : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };

    if (queryDto.pageNumber && isNaN(queryDto.pageNumber)) {
        res.status(400).json({ message: "pageNumber must be a number." });
    }
    if (queryDto.pageSize && isNaN(queryDto.pageSize)) {
        res.status(400).json({ message: "pageSize must be a number." });
    }

    try {
        // 3. Вызываем СЕРВИСный метод findAll, передавая ему подготовленный queryDto.
        // Сервис вернет объект Paged<Post>.
        const result: Paged<Post> = await postsServices.findAll(queryDto);

        // 4. Отправляем успешный ответ со статусом 200 OK и данными.
        res.status(200).json(result);
    } catch (error) {
        // 5. Обработка ошибок.
        res.status(500).json({ message: "Internal server error" });
    }
};
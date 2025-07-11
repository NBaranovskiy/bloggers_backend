
import { Request, Response } from 'express';
import {Paged, PostsQueryDto} from "../../../posts/dto/post.input-dto";
import {Post} from "../../../posts/types/post";
import {blogsServices} from "../../application/blogs.services";
import {postsServices} from "../../../posts/application/posts.services";


// GET /blogs/:blogId/posts - Получить все посты для конкретного блога с пагинацией и фильтрацией
export const getPostsByIdBlogHandler = async (
    req: Request<{ blogId: string }, {}, {}, PostsQueryDto>, // blogId теперь в params
    res: Response<Paged<Post> | { message: string }>
) => {
    const blogId = req.params.blogId; // Получаем blogId из параметров URL

    // 1. Проверяем существование блога
    try {
        await blogsServices.findByIdorFail(blogId);
    } catch (error: any) {
        // Если блог не найден, возвращаем 404
        if (error.message.includes("not found")) {
            res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
        }
            res.status(404).json({ message: "Internal server error" });
    }

    // 2. Извлекаем параметры запроса из req.query и добавляем blogId
    const queryDto: PostsQueryDto = {
        blogId: blogId, // <-- Ключевое изменение: передаем blogId для фильтрации
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        searchContentTerm: req.query.searchContentTerm ? String(req.query.searchContentTerm) : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };

    // 3. Базовая валидация параметров пагинации
    if (queryDto.pageNumber && isNaN(queryDto.pageNumber)) {
        res.status(400).json({ message: "pageNumber must be a number." });
    }
    if (queryDto.pageSize && isNaN(queryDto.pageSize)) {
        res.status(400).json({ message: "pageSize must be a number." });
    }

    try {
        // 4. Вызываем сервисный метод findAll, который теперь будет фильтровать по blogId
        const result: Paged<Post> = await postsServices.findAll(queryDto);

        // 5. Отправляем успешный ответ
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching posts for blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ... (остальные хендлеры в этом файле)
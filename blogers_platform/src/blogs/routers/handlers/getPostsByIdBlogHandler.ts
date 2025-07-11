import { Request, Response } from 'express';
import { Paged, PostsQueryDto } from "../../../posts/dto/post.input-dto";
import { Post } from "../../../posts/types/post";
import { blogsServices } from "../../application/blogs.services";
import { postsServices } from "../../../posts/application/posts.services";

// GET /blogs/:blogId/posts - Получить все посты для конкретного блога с пагинацией и фильтрацией
export const getPostsByIdBlogHandler = async (
    req: Request<{ blogId: string }, {}, {}, PostsQueryDto>,
    res: Response<Paged<Post> | { message: string }>
) => {
    const blogId = req.params.blogId; // Получаем blogId из параметров URL

    // 1. Проверяем существование блога
    try {
        // blogsServices.findByIdorFail должен выбрасывать ошибку, если блог не найден
        const blog = await blogsServices.findByIdorFail(blogId);
        if (!blog) { // Дополнительная проверка, если findByIdorFail может вернуть null
            res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
            return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
        }
    } catch (error: any) {
        // Если блог не найден (ошибка, содержащая "not found"), возвращаем 404
        if (error.message && error.message.includes("not found")) {
            res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
            return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
        }
        // Для любых других неожиданных ошибок при проверке существования блога, возвращаем 500
        console.error("Error checking blog existence:", error);
        res.status(500).json({ message: "Internal server error during blog check." });
        return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
    }

    // 2. Извлекаем параметры запроса из req.query и добавляем blogId
    const queryDto: PostsQueryDto = {
        blogId: blogId, // <-- Ключевое изменение: передаем blogId для фильтрации
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        searchContentTerm: req.query.searchContentTerm ? String(req.query.searchContentTerm) : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined, // Добавляем sortBy
        sortDirection: req.query.sortDirection ? String(req.query.sortDirection) : undefined, // Добавляем sortDirection
    };

    // 3. Базовая валидация параметров пагинации (перемещена в начало, чтобы избежать лишних вызовов сервисов)
    // Эти проверки должны быть в мидлваре валидации, но если их нет, то здесь.
    if (queryDto.pageNumber && (isNaN(queryDto.pageNumber) || queryDto.pageNumber < 1)) {
        res.status(400).json({ message: "pageNumber must be a positive number." });
        return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
    }
    if (queryDto.pageSize && (isNaN(queryDto.pageSize) || queryDto.pageSize < 1)) {
        res.status(400).json({ message: "pageSize must be a positive number." });
        return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
    }

    try {
        // 4. Вызываем сервисный метод findAll, который теперь будет фильтровать по blogId
        const result: Paged<Post> = await postsServices.findAll(queryDto);

        // 5. Отправляем успешный ответ
        res.status(200).json(result);
        return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
    } catch (error) {
        console.error("Error fetching posts for blog:", error);
        res.status(500).json({ message: "Internal server error during post fetch." });
        return; // ИСПРАВЛЕНИЕ: Просто return; без возврата res
    }
};
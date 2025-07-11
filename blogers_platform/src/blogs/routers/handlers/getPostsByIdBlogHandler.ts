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
    const blogId = req.params.blogId;

    // 1. Проверяем существование блога
    try {
        await blogsServices.findByIdorFail(blogId);
    } catch (error: any) {
        // If blog is not found (or specific "not found" error), return 404
        if (error.message.includes("not found")) {
            return res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
        }
        // For any other unexpected error during blog lookup, return 500
        console.error("Error checking blog existence:", error); // Log the actual error
        return res.status(500).json({ message: "Internal server error during blog check." });
    }

    // 2. Извлекаем параметры запроса из req.query и добавляем blogId
    const queryDto: PostsQueryDto = {
        blogId: blogId,
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        searchContentTerm: req.query.searchContentTerm ? String(req.query.searchContentTerm) : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };

    // 3. Базовая валидация параметров пагинации
    if (queryDto.pageNumber && isNaN(queryDto.pageNumber)) {
        return res.status(400).json({ message: "pageNumber must be a number." }); // Changed 404 to 400 for bad input
    }
    if (queryDto.pageSize && isNaN(queryDto.pageSize)) {
        return res.status(400).json({ message: "pageSize must be a number." }); // Changed 404 to 400 for bad input
    }

    try {
        // 4. Вызываем сервисный метод findAll, который теперь будет фильтровать по blogId
        const result: Paged<Post> = await postsServices.findAll(queryDto);

        // 5. Отправляем успешный ответ
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching posts for blog:", error);
        return res.status(500).json({ message: "Internal server error during post fetch." });
    }
};
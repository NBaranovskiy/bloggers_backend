// src/controllers/posts-controller.ts

import { Request, Response } from 'express';
import {PostInputDto} from "../../../posts/dto/post.input-dto";
import {Post} from "../../../posts/types/post";
import {blogsServices} from "../../application/blogs.services";
import {postsServices} from "../../../posts/application/posts.services";


// POST /blogs/:blogId/posts - Создать пост для конкретного блога
export const createPostForBlogHandler = async (
    // blogId в параметрах URL, PostInputDto в теле запроса
    req: Request<{ blogId: string }, {}, Omit<PostInputDto, 'blogId'>>,
    res: Response<Post | { message: string } | { errorsMessages: Array<{ message: string; field: string }> }>
) => {
    const blogId = req.params.blogId; // Получаем blogId из URL-параметров
    const { title, shortDescription, content } = req.body; // Получаем данные поста из тела запроса

    // 1. **Валидация входных данных из req.body.**
    // Это очень важный шаг! Здесь нужно убедиться, что title, shortDescription и content
    // присутствуют и имеют корректный формат.
    // Пример (простая валидация, рекомендуется использовать библиотеку типа express-validator):
    const errors: Array<{ message: string; field: string }> = [];
    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 30) {
        errors.push({ message: "Invalid or missing title. Max length 30.", field: "title" });
    }
    if (!shortDescription || typeof shortDescription !== 'string' || shortDescription.trim().length === 0 || shortDescription.length > 100) {
        errors.push({ message: "Invalid or missing shortDescription. Max length 100.", field: "shortDescription" });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0 || content.length > 1000) {
        errors.push({ message: "Invalid or missing content. Max length 1000.", field: "content" });
    }

    if (errors.length > 0) {
        res.status(404).json({ errorsMessages: errors });
    }

    // 2. **Проверка существования блога по blogId.**
    // Это критически важно, так как пост должен быть привязан к существующему блогу.
    try {
        await blogsServices.findByIdorFail(blogId); // Используем сервис блогов для проверки
    } catch (error: any) {
        if (error.message.includes("not found")) {
            // Если блог не найден, возвращаем 404
            res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
        }
        // Для других непредвиденных ошибок при проверке блога
        console.error("Error checking blog existence:", error);
        res.status(500).json({ message: "Internal server error" });
    }

    // 3. **Подготовка PostInputDto.**
    // Собираем все данные, включая blogId, для передачи в сервис.
    const newPostData: PostInputDto = {
        title,
        shortDescription,
        content,
        blogId: blogId // blogId берется из URL-параметров
    };

    try {
        // 4. **Вызываем сервисный метод для создания поста.**
        const createdPost: Post = await postsServices.create(newPostData);

        // 5. **Отправляем успешный ответ со статусом 201 Created.**
        res.status(201).json(createdPost);
    } catch (error) {
        // 6. **Обработка ошибок при создании поста (если не связаны с blogId).**
        console.error("Error creating post for blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ... (остальные хендлеры в этом файле)
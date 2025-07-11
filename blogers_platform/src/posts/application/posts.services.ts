import { Paged, PostInputDto, PostsQueryDto } from "../dto/post.input-dto";
import { Post } from "../types/post";
import { postsRepository } from "../repositories/posts.repository";

export const postsServices = {
    /**
     * Получает все посты с пагинацией, фильтрацией и сортировкой.
     * @param queryDto Параметры запроса.
     * @returns Объект Paged<Post>.
     */
    async findAll(queryDto: PostsQueryDto): Promise<Paged<Post>> {
        return postsRepository.findAll(queryDto);
    },

    /**
     * Находит пост по ID или возвращает null.
     * @param id ID поста.
     * @returns Объект Post или null.
     */
    async findByIdorFail(id: string): Promise<Post | null> {
        return postsRepository.findById(id);
    },

    /**
     * Создает новый пост.
     * @param queryDto Данные для создания поста.
     * @returns Созданный объект Post.
     */
    async create(queryDto: PostInputDto): Promise<Post> {
        return postsRepository.create(queryDto);
    },

    /**
     * Обновляет существующий пост.
     * @param id ID поста для обновления.
     * @param queryDto Новые данные поста.
     * @returns true, если пост успешно обновлен, иначе false.
     */
    async update(id: string, queryDto: PostInputDto): Promise<boolean> {
        // ИСПРАВЛЕНИЕ: Вызов метода репозитория, а не рекурсивный вызов сервиса.
        return postsRepository.update(id, queryDto);
    },

    /**
     * Удаляет пост по ID.
     * @param id ID поста для удаления.
     * @returns true, если пост успешно удален, иначе false.
     */
    async delete(id: string): Promise<boolean> {
        // ИСПРАВЛЕНИЕ: Вызов метода репозитория, а не рекурсивный вызов сервиса.
        return postsRepository.delete(id);
    },
};

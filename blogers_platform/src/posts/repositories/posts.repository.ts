// src/posts/posts.repository.ts
import { Post } from '../types/post'; // Убедитесь, что это ваш текущий тип Post
import { PostInputDto } from '../dto/post.input-dto'; // Ваш DTO для создания/обновления поста
import { postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb'; // ObjectId по-прежнему нужен для _id

// Импортируем bloggersRepository для получения blogName
import { bloggersRepository } from '../../blogs/repositories/bloggers.repository'; // Уточните путь

export const postsRepository = {
  /**
   * Находит все посты в коллекции.
   * @returns Promise<WithId<Post>[]> - Массив постов.
   */
  async findAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray();
  },

  /**
   * Находит пост по его MongoDB _id.
   * @param id string - ID поста.
   * @returns Promise<WithId<Post> | null> - Пост или null, если не найден.
   */
  async findById(id: string): Promise<WithId<Post> | null> {
    // Важно: всегда проверяйте, что id - это валидный ObjectId перед попыткой создания ObjectId.
    // Если id не валидный, ObjectId выбросит ошибку, и findOne не сможет работать.
    if (!ObjectId.isValid(id)) {
      return null; // Или можно выбросить ошибку: throw new Error('Invalid ObjectId format');
    }
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  /**
   * Создает новый пост в коллекции.
   * @param newPost Post - Объект нового поста для вставки.
   * @returns Promise<WithId<Post>> - Созданный пост с присвоенным _id.
   */
  async create(dto: PostInputDto): Promise<WithId<Post>> { // Принимаем DTO
    // Получаем детали блога, чтобы получить blogName для денормализации
    const blog = await bloggersRepository.findById(dto.blogId);

    if (!blog) {
      // Эта ситуация должна быть поймана валидацией ранее,
      // но это хорошая проверка на всякий случай.
      throw new Error('Associated blog not found.');
    }

    const newPost: Post = {
      // id: new ObjectId().toString(), // <--- Эту строку УДАЛЯЕМ
      ...dto, // Распространяем свойства из DTO (title, shortDescription, content, blogId)
      blogName: blog.name, // Присваиваем имя найденного блога
      createdAt: new Date().toISOString(), // Строка ISO 8601 для $date-time
    };

    const insertResult = await postsCollection.insertOne(newPost);

    // MongoDB автоматически добавляет _id к newPost после insertOne
    // Мы возвращаем newPost, так как _id теперь есть
    return { ...newPost, _id: insertResult.insertedId };
  },

  /**
   * Обновляет существующий пост по его MongoDB _id.
   * @param id string - ID поста для обновления.
   * @param dto PostInputDto - DTO с обновленными данными поста.
   * @returns Promise<void>
   * @throws Error 'Post not exist' если пост не найден для обновления.
   */
  async update(id: string, dto: PostInputDto): Promise<void> {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId format');
    }

    const updateResult = await postsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId // Если blogId можно обновлять
          // Если вы храните blogName, его тоже нужно обновить здесь,
          // возможно, потребовав повторного поиска блога по ID
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Post not exist');
    }
    return;
  },

  /**
   * Удаляет пост по его MongoDB _id.
   * @param id string - ID поста для удаления.
   * @returns Promise<void>
   * @throws Error 'Post not exist' если пост не найден для удаления.
   */
  async delete(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId format');
    }

    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Post not exist');
    }
    return;
  },
};
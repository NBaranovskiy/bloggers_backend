// src/posts/posts.repository.ts
import { Post } from '../types/post';
import { Paged, PostInputDto, PostsQueryDto } from '../dto/post.input-dto';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId, Filter, SortDirection } from 'mongodb';
import { mapMongoDocumentToPost } from '../../core/utils/mappers';
import { bloggersRepository } from '../../blogs/repositories/bloggers.repository';

export const postsRepository = {
  /**
   * Находит все посты с применением фильтрации, пагинации и сортировки.
   * @param queryDto Объект с параметрами запроса для фильтрации, пагинации и сортировки.
   * @returns Объект Paged<Post>, содержащий список постов и информацию о пагинации.
   */
  async findAll(queryDto: PostsQueryDto): Promise<Paged<Post>> {
    const {
      searchNameTerm, // Для поиска по названию поста (title)
      searchContentTerm, // Для поиска по содержимому поста (content)
      blogId, // Для фильтрации постов по ID блога
      pageNumber = 1, // Номер текущей страницы, по умолчанию 1
      pageSize = 10, // Количество элементов на странице, по умолчанию 10
      sortBy = 'createdAt', // Поле для сортировки, по умолчанию 'createdAt'
      sortDirection = 'desc' // Направление сортировки, по умолчанию 'desc' (убывание)
    } = queryDto;

    const filter: Filter<any> = {};

    // Применяем фильтр по названию поста
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }; // Поиск без учета регистра
    }
    // Применяем фильтр по содержимому поста
    if (searchContentTerm) {
      filter.content = { $regex: searchContentTerm, $options: 'i' }; // Поиск без учета регистра
    }
    // Применяем фильтр по ID блога, если он указан
    if (blogId) {
      filter.blogId = blogId; // blogId хранится как строка
    }

    // Определяем параметры сортировки
    const sortOptions: { [key: string]: SortDirection } = {
      [sortBy]: sortDirection === 'asc' ? 1 : -1 // 1 для asc, -1 для desc
    };

    // Рассчитываем смещение для пагинации
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    // Получаем общее количество документов, соответствующих фильтру
    const totalCount = await postsCollection.countDocuments(filter);

    // Получаем отфильтрованные, отсортированные и пагинированные данные
    const postsFromDb: any[] = await postsCollection
      .find(filter)
      .sort(sortOptions) // Применяем динамическую сортировку
      .skip(skip)
      .limit(limit)
      .toArray();

    // Преобразуем документы MongoDB в объекты Post
    const items: Post[] = postsFromDb.map(mapMongoDocumentToPost);

    // Рассчитываем общее количество страниц
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items
    };
  },

  /**
   * Находит пост по его ID.
   * @param id Строковый ID поста.
   * @returns Объект Post или null, если пост не найден или ID невалиден.
   */
  async findById(id: string): Promise<Post | null> {
    // Проверяем валидность ObjectId
    if (!ObjectId.isValid(id)) {
      return null;
    }
    // Находим пост по _id
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null; // Если пост не найден, возвращаем null
    }
    // Преобразуем документ MongoDB в объект Post
    return mapMongoDocumentToPost(post);
  },

  /**
   * Создает новый пост.
   * @param dto Объект с данными для создания поста.
   * @returns Созданный объект Post.
   * @throws Error Если связанный блог не найден.
   */
  async create(dto: PostInputDto): Promise<Post> {
    // Находим связанный блог для получения его имени
    const blog = await bloggersRepository.findById(dto.blogId);

    if (!blog) {
      // Это условие должно быть обработано на уровне валидации или контроллера
      // Здесь выбрасываем ошибку, чтобы она была поймана выше.
      throw new Error('Associated blog not found.');
    }

    // Создаем объект поста для вставки в базу данных
    const postToInsert = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name, // Используем имя блога
      createdAt: new Date().toISOString(), // Дата создания поста
    };

    // Вставляем новый пост в коллекцию
    const insertResult = await postsCollection.insertOne(postToInsert);

    // Возвращаем созданный пост с `id` вместо `_id`
    return {
      ...postToInsert,
      id: insertResult.insertedId.toString(),
    } as Post;
  },

  /**
   * Обновляет существующий пост по ID.
   * @param id Строковый ID поста.
   * @param dto Объект с обновленными данными поста.
   * @returns true, если пост был обновлен, иначе false.
   */
  async update(id: string, dto: PostInputDto): Promise<boolean> {
    // Проверяем валидность ObjectId
    if (!ObjectId.isValid(id)) {
      return false; // Невалидный ID, считаем, что пост не найден
    }

    // Обновляем пост в коллекции
    const updateResult = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
          // blogName не обновляется здесь, так как он зависит от blogId
          // Если blogId меняется, blogName должен быть обновлен на уровне сервиса/контроллера
        },
      },
    );
    // Возвращаем true, если документ был найден и изменен, иначе false
    return updateResult.modifiedCount > 0;
  },

  /**
   * Удаляет пост по ID.
   * @param id Строковый ID поста.
   * @returns true, если пост был удален, иначе false.
   */
  async delete(id: string): Promise<boolean> {
    // Проверяем валидность ObjectId
    if (!ObjectId.isValid(id)) {
      return false; // Невалидный ID, считаем, что пост не найден
    }

    // Удаляем пост из коллекции
    const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    // Возвращаем true, если документ был найден и удален, иначе false
    return deleteResult.deletedCount > 0;
  },
};

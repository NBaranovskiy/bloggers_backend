// src/posts/posts.repository.ts
import { Post } from '../types/post';
import {Paged, PostInputDto, PostsQueryDto} from '../dto/post.input-dto';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId, Filter,SortDirection } from 'mongodb';
import {mapMongoDocumentToPost} from "../../core/utils/mappers";
import { bloggersRepository } from '../../blogs/repositories/bloggers.repository';

export const postsRepository = {
  async findAll(queryDto: PostsQueryDto): Promise<Paged<Post>> {
        const {
            searchNameTerm,
            searchContentTerm,
            blogId,
            pageNumber = 1,
            pageSize = 10
        } = queryDto;

        const filter: Filter<any> = {};

        if (searchNameTerm) {
            filter.title = { $regex: searchNameTerm, $options: 'i' };
        }
        if (searchContentTerm) {
            filter.content = { $regex: searchContentTerm, $options: 'i' };
        }
        if (blogId) {
            filter.blogId = blogId; // blogId хранится как строка
        }

        // Дефолтная сортировка, если не указана другая
        const sortOptions: { createdAt: SortDirection } = { createdAt: -1 }; // Сортируем по дате создания в убывающем порядке по умолчанию

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        // Получаем общее количество документов, соответствующих фильтру
        const totalCount = await postsCollection.countDocuments(filter);
        // Получаем отфильтрованные и пагинированные данные
        const postsFromDb: any[] = await postsCollection
            .find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray();

        const items: Post[] = postsFromDb.map(mapMongoDocumentToPost);

        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    },

  async findById(id: string): Promise<Post | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return mapMongoDocumentToPost(post);
  },

  async create(dto: PostInputDto): Promise<Post> {
    const blog = await bloggersRepository.findById(dto.blogId);

    if (!blog) {
      throw new Error('Associated blog not found.'); // Валидация должна это поймать.
    }

    const postToInsert = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const insertResult = await postsCollection.insertOne(postToInsert);

    return {
      ...postToInsert,
      id: insertResult.insertedId.toString(),
    } as Post;
  },

  // --- РЕКОМЕНДУЕМЫЕ ИСПРАВЛЕНИЯ ДЛЯ "ПРАВИЛЬНОЙ ПРОВЕРКИ" ---
  async update(id: string, dto: PostInputDto): Promise<boolean> { // Возвращает boolean
    if (!ObjectId.isValid(id)) {
      return false; // Невалидный ID, считаем, что не найдено
    }

    const updateResult = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );
    // Возвращаем true, если документ был найден и изменен, иначе false
    return updateResult.modifiedCount  > 0;
  },

  async delete(id: string): Promise<boolean> { // Возвращает boolean
    if (!ObjectId.isValid(id)) {
      return false; // Невалидный ID, считаем, что не найдено
    }

    const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    // Возвращаем true, если документ был найден и удален, иначе false
    return deleteResult.deletedCount > 0;
  },
};
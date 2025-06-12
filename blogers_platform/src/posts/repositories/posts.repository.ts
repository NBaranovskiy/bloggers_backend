// src/posts/posts.repository.ts
import { Post } from '../types/post';
import { PostInputDto } from '../dto/post.input-dto';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';

import { bloggersRepository } from '../../blogs/repositories/bloggers.repository';

function mapMongoDocumentToPost(doc: any): Post { // Используем any для гибкости при преобразовании _id
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
  } as Post;
}

export const postsRepository = {
  async findAll(): Promise<Post[]> {
    const posts = await postsCollection.find().toArray();
    return posts.map(mapMongoDocumentToPost);
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
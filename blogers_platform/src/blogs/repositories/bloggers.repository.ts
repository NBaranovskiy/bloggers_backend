import { Blogger } from '../types/blogger';
import { BlogInputDto } from '../dto/blog.input-dto';
import {bloggersCollection, postsCollection} from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import {PostInputDto} from "../../posts/dto/post.input-dto";

export const bloggersRepository = {
  async findAll(): Promise<Blogger[]> { // Возвращаем Blogger[], а не WithId<Blogger>[]
    const bloggers = await bloggersCollection.find().toArray();
    // Преобразуем _id в id для каждого блогера
    return bloggers.map(b => ({
      ...b,
      id: b._id.toString(), // Преобразуем ObjectId в строку для поля id
      _id: undefined // Удаляем _id, если он не нужен в конечном объекте
    })) as Blogger[]; // Приводим к Blogger[]
  },

  async findById(id: string): Promise<Blogger | null> { // Возвращаем Blogger, а не WithId<Blogger>
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const blogger = await bloggersCollection.findOne({ _id: new ObjectId(id) });
    if (!blogger) {
      return null;
    }
    // Преобразуем _id в id при получении одного блогера
    return {
      ...blogger,
      id: blogger._id.toString(),
      _id: undefined // Удаляем _id
    } as Blogger;
  },

  async create(dto: BlogInputDto): Promise<Blogger> { // Возвращаем Blogger, а не WithId<Blogger>
    const newBloggerData = { // Создаем объект без _id, так как он будет добавлен MongoDB
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false
    };

    const insertResult = await bloggersCollection.insertOne(newBloggerData);

    // Возвращаем объект, который соответствует ожиданиям тестов (с полем `id`)
    return {
      ...newBloggerData,
      id: insertResult.insertedId.toString(), // Используем _id от MongoDB как ваш id
      _id: undefined // Опционально: если вы не хотите видеть _id в возвращаемом объекте
    } as Blogger;
  },

  async update(id: string, dto: BlogInputDto): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid Blogger ID');
    }
    const updateResult = await bloggersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: dto.name, description: dto.description, websiteUrl: dto.websiteUrl } },
    );
    return updateResult.modifiedCount  > 0;
  },



  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const deleteResult = await bloggersCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount > 0;
  },
};
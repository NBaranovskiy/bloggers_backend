import { Blogger } from '../types/blogger';
import { BlogInputDto, BlogQueryDto } from '../dto/blog.input-dto';
import {bloggersCollection, postsCollection} from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import {PostInputDto} from "../../posts/dto/post.input-dto";

export const bloggersRepository = {
    async findAll(queryDto: BlogQueryDto): Promise<{ items: Blogger[]; totalCount: number }> {
      const bloggersFromDb: Blogger[] = await bloggersCollection.find({}).toArray();
      const items: Blogger[] = bloggersFromDb.map(b => ({
        ...b, // Копируем все существующие поля (name, description, websiteUrl, createdAt, isMembership)
        id: b._id ? b._id.toString() : b.id // Если есть _id, преобразуем его, иначе используем уже существующий id
      }));
      return {
        items: items,
        totalCount: items.length // Пока totalCount равен количеству полученных элементов
      };
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
      return false;
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


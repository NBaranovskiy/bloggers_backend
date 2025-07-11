import { Blogger } from '../types/blogger';
import { BlogInputDto, BlogQueryDto } from '../dto/blog.input-dto';
import { bloggersCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';

export const bloggersRepository = {
    /**
     * Возвращает список блогеров с пагинацией и фильтрацией.
     * Преобразует `_id` в `id` и удаляет `_id` из конечного объекта.
     * @param queryDto Параметры запроса для фильтрации и пагинации.
     * @returns Объект с массивом блогеров и общим количеством.
     */
    async findAll(queryDto: BlogQueryDto): Promise<{ items: Blogger[]; totalCount: number, pagesCount: number, page: number, pageSize: number }> {
      // Устанавливаем значения по умолчанию для пагинации и сортировки
      const pageNumber = queryDto.pageNumber ? Number(queryDto.pageNumber) : 1;
      const pageSize = queryDto.pageSize ? Number(queryDto.pageSize) : 10;
      const sortBy = queryDto.sortBy || 'createdAt'; // По умолчанию сортируем по createdAt
      const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1; // 1 для asc, -1 для desc
      const searchNameTerm = queryDto.searchNameTerm ? String(queryDto.searchNameTerm) : undefined;

      // Формируем фильтр для MongoDB
      const filter: any = {};
      if (searchNameTerm) {
        filter.name = { $regex: searchNameTerm, $options: 'i' }; // Поиск по имени без учета регистра
      }

      // Получаем общее количество документов, соответствующих фильтру
      const totalCount = await bloggersCollection.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      // Получаем блогеров из базы данных с учетом пагинации, сортировки и фильтрации
      const bloggersFromDb = await bloggersCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection }) // Применяем сортировку
        .skip((pageNumber - 1) * pageSize) // Пропускаем нужное количество документов
        .limit(pageSize) // Ограничиваем количество документов на страницу
        .toArray();

      // Преобразуем каждый объект блогера: удаляем _id и добавляем id
      const items: Blogger[] = bloggersFromDb.map(b => {
        const { _id, ...restOfBlogger } = b;
        return {
          ...restOfBlogger,
          id: _id.toString()
        } as Blogger;
      });

      return {
        items: items,
        totalCount: totalCount,
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize
      };
    },

    /**
     * Находит блогера по его ID.
     * Преобразует `_id` в `id` и удаляет `_id` из конечного объекта.
     * @param id Строковый ID блогера.
     * @returns Объект блогера или null, если не найден.
     */
    async findById(id: string): Promise<Blogger | null> {
      // Проверяем валидность ObjectId
      if (!ObjectId.isValid(id)) {
        return null;
      }
      // Находим блогера по _id
      const blogger = await bloggersCollection.findOne({ _id: new ObjectId(id) });
      if (!blogger) {
        return null; // Если блогер не найден, возвращаем null
      }

      // Деструктурируем объект: извлекаем _id, остальное в restOfBlogger
      const { _id, ...restOfBlogger } = blogger;

      // Возвращаем новый объект с id вместо _id
      return {
        ...restOfBlogger, // Распространяем все остальные свойства
        id: _id.toString() // Добавляем новое свойство 'id'
      } as Blogger;
    },

    /**
     * Создает нового блогера.
     * Возвращает созданного блогера с `id` полем, но без `_id`.
     * @param dto Объект с данными для создания блогера.
     * @returns Созданный объект блогера.
     */
    async create(dto: BlogInputDto): Promise<Blogger> {
      const newBloggerData = {
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
      };

      // Вставляем нового блогера в коллекцию
      const insertResult = await bloggersCollection.insertOne(newBloggerData);

      // Возвращаем объект, который соответствует ожиданиям тестов (с полем `id` и без `_id`)
      return {
        ...newBloggerData, // Распространяем все поля из newBloggerData
        id: insertResult.insertedId.toString(), // Используем _id от MongoDB как ваш id
      } as Blogger; // Приводим к типу Blogger (который не содержит _id)
    },

    /**
     * Обновляет данные существующего блогера по ID.
     * @param id Строковый ID блогера.
     * @param dto Объект с обновленными данными блогера.
     * @returns true, если блогер был обновлен, иначе false.
     */
    async update(id: string, dto: BlogInputDto): Promise<boolean> {
      // Проверяем валидность ObjectId
      if (!ObjectId.isValid(id)) {
        return false;
      }
      // Обновляем блогера в коллекции
      const updateResult = await bloggersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: dto.name, description: dto.description, websiteUrl: dto.websiteUrl } },
      );
      return updateResult.modifiedCount > 0; // Возвращаем true, если был изменен хотя бы один документ
    },

    /**
     * Удаляет блогера по ID.
     * @param id Строковый ID блогера.
     * @returns true, если блогер был удален, иначе false.
     */
    async delete(id: string): Promise<boolean> {
      // Проверяем валидность ObjectId
      if (!ObjectId.isValid(id)) {
        return false;
      }
      // Удаляем блогера из коллекции
      const deleteResult = await bloggersCollection.deleteOne({ _id: new ObjectId(id) });
      return deleteResult.deletedCount > 0; // Возвращаем true, если был удален хотя бы один документ
    },
};
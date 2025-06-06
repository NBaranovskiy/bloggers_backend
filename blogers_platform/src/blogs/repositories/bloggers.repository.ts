import { Blogger } from '../types/blogger';
import { BlogInputDto } from '../dto/blog.input-dto';
import { bloggersCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
 
export const bloggersRepository = {
  async findAll(): Promise<WithId<Blogger>[]> {
    return bloggersCollection.find().toArray();
  },
 
  async findById(id: string): Promise<WithId<Blogger> | null> {
    return bloggersCollection.findOne({ _id: new ObjectId(id) });
  },
 
  async create(dto: BlogInputDto): Promise<WithId<Blogger>> { // Pass the DTO here
    // Generate the new properties
    const newBlogger: Blogger = {
      ...dto, // Spread properties from the DTO
      id: new ObjectId().toString(), // Generate a custom string ID if you use it, or remove if _id is enough
      createdAt: new Date().toISOString(), // ISO 8601 string for $date-time
      isMembership: false // Default to false when creating a new blog
    };
    const insertResult = await bloggersCollection.insertOne(newBlogger);

    // MongoDB automatically adds _id to newBlogger after insertOne
    return { ...newBlogger, _id: insertResult.insertedId };
  },
 
  async update(id: string, dto: BlogInputDto): Promise<void> {
    const updateResult = await bloggersCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl
        },
      },
    );
 
    if (updateResult.matchedCount < 1) {
      throw new Error('Blogger not exist');
    }
    return;
  },
 
  async delete(id: string): Promise<void> {
    const deleteResult = await bloggersCollection.deleteOne({
      _id: new ObjectId(id),
    });
 
    if (deleteResult.deletedCount < 1) {
      throw new Error('Blogger not exist');
    }
    return;
  },
};
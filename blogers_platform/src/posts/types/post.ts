// src/types/post.ts (пример)
import { ObjectId } from 'mongodb';

export type Post = {
    _id?: ObjectId; // MongoDB _id
    id?: string; // Your custom string ID, if needed for tests/API
    title: string;
    shortDescription: string;
    content: string;
    blogId: string; // Ссылка на ID блога
    blogName: string;
    // blogName: string; // Если хотите хранить название блога прямо в посте для денормализации
    createdAt: string; // Или Date
};
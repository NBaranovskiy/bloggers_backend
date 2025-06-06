// src/types/post.ts (пример)
import { ObjectId } from 'mongodb';

export type Post = {
    _id?: ObjectId; // MongoDB _id
    title: string;
    shortDescription: string;
    content: string;
    blogId: string; // Ссылка на ID блога
    blogName: string;
    // blogName: string; // Если хотите хранить название блога прямо в посте для денормализации
    createdAt: string; // Или Date
};
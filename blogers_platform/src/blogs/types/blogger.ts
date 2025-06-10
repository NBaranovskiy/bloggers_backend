// src/types/blogger.ts
import { ObjectId } from 'mongodb';

export type Blogger = {
    _id?: ObjectId; // MongoDB's default ID, usually ObjectId
    id?: string; // Your custom string ID, if needed for tests/API
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};
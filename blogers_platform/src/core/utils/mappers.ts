// src/utils/mappers.ts
import {Post } from '../../posts/types/post';
import {ObjectId} from 'mongodb';

export function mapMongoDocumentToPost(doc: any): Post {
    if (!doc || !(doc._id instanceof ObjectId)) {
        // Handle cases where the document is null, undefined, or _id is not an ObjectId
        throw new Error("Invalid MongoDB document for Post mapping.");
    }
    const { _id, ...rest } = doc;
    return {
        ...rest,
        id: _id.toString(), // Convert ObjectId to string 'id'
        // Ensure blogId and blogName are also correctly mapped if they come from DB differently
    } as Post;
}
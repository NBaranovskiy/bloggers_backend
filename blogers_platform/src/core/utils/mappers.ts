// src/utils/mappers.ts
import {Post } from '../../posts/types/post';

export function mapMongoDocumentToPost(doc: any): Post {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
  } as Post;
}
import { PostInputDto } from '../dto/post.input-dto';
import { ValidationError } from '../types/ValidationError';
import {type} from "node:os";
import {db} from "../../db/in-memory.db";

export const PostInputDtoValidation = (data: PostInputDto): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim().length < 2 ||
    data.title.trim().length > 30
  ) {
    errors.push({ message: 'Invalid title',field: 'title' });
  }
  if (
    !data.shortDescription ||
    typeof data.shortDescription !== 'string' ||
    data.shortDescription.trim().length < 2 ||
    data.shortDescription.trim().length > 100
  ) {
    errors.push({message: 'Invalid shortDescription',field: 'shortDescription'});
  }
  if (
    !data.content ||
    typeof data.content !== 'string' ||
    data.content.trim().length < 2 ||
    data.content.trim().length > 1000
  ) {
    errors.push({ message: 'Invalid content',field: 'content' });
  }
  if (!data.blogId ||
      typeof data.blogId !== 'string' ||
      db.bloggers.findIndex(d => d.id === data.blogId) === -1
  ) {
    errors.push({  message: 'Invalid blogId',field: 'blogId' });
  }




  return errors;
};
import { BlogInputDto } from '../dto/blog.input-dto';
import { ValidationError } from '../types/ValidationError';

export const PostInputDtoValidation = (data: BlogInputDto): ValidationError[] => {
  const errors: ValidationError[] = [];

  return errors;
};
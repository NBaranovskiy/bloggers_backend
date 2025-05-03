import { BlogInputDto } from '../dto/blog.input-dto';
import { ValidationError } from '../types/ValidationError';

export const BlogInputDtoValidation = (data: BlogInputDto): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 15
  ) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }
  if (
    !data.description ||
    typeof data.description !== 'string' ||
    data.description.trim().length < 2 ||
    data.description.trim().length > 500
  ) {
    errors.push({ field: 'description', message: 'Invalid description' });
  }

  if (
    !data.websiteUrl ||
    typeof data.websiteUrl !== 'string' ||
    data.websiteUrl.trim().length < 2 ||
    data.websiteUrl.trim().length > 100
  ) {
    errors.push({ field: 'websiteUrl', message: 'Invalid websiteUrl' });
  }

  return errors;
};
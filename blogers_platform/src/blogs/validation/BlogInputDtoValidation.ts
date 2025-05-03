import { BlogInputDto } from '../dto/blog.input-dto';
import { ValidationError } from '../types/ValidationError';

export const BlogInputDtoValidation = (data: BlogInputDto): ValidationError[] => {
  const errors: ValidationError[] = [];
  const websiteUrlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 15
  ) {
    errors.push({ message: 'Invalid name',field: 'name' });
  }
  if (
    !data.description ||
    typeof data.description !== 'string' ||
    data.description.trim().length < 2 ||
    data.description.trim().length > 500
  ) {
    errors.push({ message: 'Invalid description',field: 'description' });
  }

  if (
    !data.websiteUrl ||
    typeof data.websiteUrl !== 'string' ||
    data.websiteUrl.trim().length < 2 ||
    data.websiteUrl.trim().length > 100 ||
    !websiteUrlPattern.test(data.websiteUrl.trim())
  )  {
  errors.push({
    message: 'Invalid websiteUrl.',
    field: 'websiteUrl'
  });
}

  return errors;
};
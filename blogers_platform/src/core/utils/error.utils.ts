import {ValidationError} from "../../blogs/types/ValidationError";

export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
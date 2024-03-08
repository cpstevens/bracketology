import { BracketSummaryUploadData } from '~/types/brackets';
import { isStringNullOrWhitespace } from '../util/string';
import {
  FieldValidationFunction,
  ValidationFunction,
  ValidationResult,
} from '../validateFormData';

// TODO - add validation around bracket summary fields
export const validateBracketSummary: ValidationFunction<
  BracketSummaryUploadData
> = (data: FormData) => {
  const name = data.get('name')?.toString();
  const description = data.get('description')?.toString();
  const category = data.get('category')?.toString();

  const { value: bracketName, error: bracketNameError } =
    validateBracketName(name);

  const { value: bracketDescription, error: bracketDescriptionError } =
    validateBracketDescription(description);

  const { value: bracketCategory, error: bracketCategoryError } =
    validateBracketCategory(category);

  const hasErrors =
    !!bracketNameError || !!bracketCategoryError || !!bracketDescriptionError;

  const values: BracketSummaryUploadData = {
    name: bracketName,
    description: bracketDescription,
    category: bracketCategory,
  };

  const errors: Record<keyof BracketSummaryUploadData, string | undefined> = {
    name: bracketNameError,
    description: bracketDescriptionError,
    category: bracketCategoryError,
  };

  return { values, errors, hasErrors };
};

const validateBracketCategory: FieldValidationFunction<string> = (
  category: string | undefined
) => {
  if (isStringNullOrWhitespace(category)) {
    return { value: '', error: 'Bracket category is required' };
  }

  if (Number.isNaN(parseInt(category!, 10))) {
    return { value: category!, error: 'Bracket category must be a number' };
  }

  return { value: category!, error: undefined };
};

const validateBracketDescription: FieldValidationFunction<string> = (
  description: string | undefined
) => {
  if (description?.length && description.length > 150) {
    return {
      value: description || '',
      error: 'Bracket description cannot be more than 150 characters',
    };
  }

  return { value: description || '', error: undefined };
};

const validateBracketName: FieldValidationFunction<string> = (
  name: string | undefined
) => {
  if (isStringNullOrWhitespace(name)) {
    return { value: '', error: 'Bracket name must not be empty' };
  }

  if (name?.length && name.length > 25) {
    return {
      value: name!,
      error: 'Bracket name cannot be more than 25 characters',
    };
  }

  return { value: name!, error: undefined };
};

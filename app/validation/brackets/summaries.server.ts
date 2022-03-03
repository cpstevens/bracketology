import { BracketSummaryUploadData } from '~/types/brackets';
import { ValidationFunction, ValidationResult } from '../validateFormData';

// TODO - add validation around bracket summary fields
export const validateBracketSummary: ValidationFunction<
  BracketSummaryUploadData
> = (data: FormData) => {
  const name = data.get('name')?.toString();
  const description = data.get('description')?.toString();
  const category = data.get('category')?.toString();

  const values: BracketSummaryUploadData = {
    name: name || '',
    description: description || '',
    category: category || '1',
  };

  const errors: Record<keyof BracketSummaryUploadData, string> = {
    name: '',
    description: '',
    category: '',
  };

  return { values, errors };
};

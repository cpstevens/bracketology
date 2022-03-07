import { BracketEntryDetails, BracketEntryUploadData } from '~/types/brackets';
import { isPowerOfTwo } from '../util/number';
import { isStringNullOrWhitespace } from '../util/string';
import {
  FieldValidationFunction,
  ValidationFunction,
} from '../validateFormData';

export interface BracketEntryErrors
  extends Record<keyof BracketEntryDetails, string> {
  entryErrors: Record<number, string>;
}

// TODO - add validation around bracket summary fields
export const validateBracketEntries: ValidationFunction<BracketEntryDetails> = (
  data: FormData
) => {
  const entryCount = data.get('totalEntries')?.toString();
  const { value: totalEntries, error: totalEntriesError } =
    validateEntryCount(entryCount);
  let hasErrors = !!totalEntriesError;

  const values: BracketEntryDetails = {
    totalEntries,
    entries: [] as BracketEntryUploadData[],
  };

  const errors: BracketEntryErrors = {
    totalEntries: '',
    entries: '',
    entryErrors: {} as Record<number, string>,
  };

  for (let i = 0; i < totalEntries; i += 1) {
    const entryName = data.get(`entry-${i}`)?.toString();
    const { error: entryError, value: entryValue } =
      validateBracketEntry(entryName);

    if (!!entryError) {
      hasErrors = true;
      errors.entryErrors[i] = entryError;
    }

    const entryData: BracketEntryUploadData = {
      entryName: entryValue,
      bracketEntryId: i,
    };

    values.entries.push(entryData);
  }

  return { values, errors, hasErrors };
};

const validateBracketEntry: FieldValidationFunction<string> = (
  entryName: string | undefined
) => {
  if (isStringNullOrWhitespace(entryName)) {
    return { value: '', error: 'Entry name must not be empty' };
  }

  return { value: entryName!, error: undefined };
};

const validateEntryCount: FieldValidationFunction<number> = (
  entryCount: string | undefined
) => {
  if (isStringNullOrWhitespace(entryCount)) {
    return { value: 0, error: 'Entry count must be provided' };
  }

  const numericCount = parseInt(entryCount!, 10);

  if (numericCount === NaN) {
    return { value: 0, error: 'Entry count must be a number' };
  }

  if (!isPowerOfTwo(numericCount)) {
    return { value: 0, error: 'Entry count must be a power of 2' };
  }

  return { value: numericCount, error: undefined };
};

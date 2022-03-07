export type ValidationResult<T extends {}> = {
  values: T;
  hasErrors: boolean;
  errors: Record<keyof T, string | undefined>;
};

export type FieldValidationFunction<T> = (input: string | undefined) => {
  value: T;
  error: string | undefined;
};

export type ValidationFunction<T extends {}> = (
  data: FormData
) => ValidationResult<T>;

export const validateFormData = <T extends {}>(
  data: FormData,
  validationFunction: ValidationFunction<T>
): ValidationResult<T> => {
  return validationFunction(data);
};

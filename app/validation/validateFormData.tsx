export type ValidationResult<T extends {}> = {
  values: T;
  errors: Record<keyof T, string>;
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

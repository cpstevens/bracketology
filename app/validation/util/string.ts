export const isStringNullOrWhitespace = (
  input: string | undefined
): boolean => {
  if (!input) {
    return true;
  }

  if (input === '' || input.trim() === '') {
    return true;
  }

  return false;
};

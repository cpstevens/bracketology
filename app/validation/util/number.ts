export const isPowerOfTwo = (input: number): boolean => {
  return Math.log2(input) % 1 === 0;
};

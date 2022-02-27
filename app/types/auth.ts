export type SignUpRequest = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type LoginRequest = {
  username?: string;
  email?: string;
  password: string;
};

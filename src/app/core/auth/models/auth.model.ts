export interface User {
  username: string;
  loginTime?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

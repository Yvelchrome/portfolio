/**
 * Shared types for admin authentication feature
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string | undefined;
}

export interface UserResponse {
  user: User;
}

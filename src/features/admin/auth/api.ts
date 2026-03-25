import {
  ErrorResponseSchema,
  type LoginCredentials,
  type LoginResponse,
  LoginResponseSchema,
  type UserResponse,
  UserResponseSchema,
  parseJsonWithZod,
} from "lib/schemas";

const API_BASE = "/api/auth";

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await parseJsonWithZod(response, ErrorResponseSchema);
    throw new Error(error.error);
  }

  return parseJsonWithZod(response, LoginResponseSchema);
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function refreshToken(): Promise<void> {
  const response = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await fetch(`${API_BASE}/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return parseJsonWithZod(response, UserResponseSchema);
}

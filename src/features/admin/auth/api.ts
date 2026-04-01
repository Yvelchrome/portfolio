import {
  ErrorResponseSchema,
  type LoginCredentials,
  type LoginResponse,
  LoginResponseSchema,
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

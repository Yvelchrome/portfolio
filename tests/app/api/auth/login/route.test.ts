import { beforeEach, describe, expect, it, vi } from "vitest";

import { NextRequest } from "next/server";

import { POST as loginPost } from "app/api/auth/login/route";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("lib/prisma/prisma", () => ({
  prisma: mockPrisma,
}));

const createRequest = (
  url: string,
  options: { method?: string; body?: unknown } = {},
): NextRequest => {
  const requestOptions: {
    method: string;
    headers: Record<string, string>;
    body?: BodyInit;
  } = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (options.body) {
    requestOptions.body = JSON.stringify(options.body);
  }

  return new NextRequest(`http://localhost:3000${url}`, requestOptions);
};

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 with invalid credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const request = createRequest("/api/auth/login", {
      method: "POST",
      body: {
        email: "wrong@example.com",
        password: "wrongpassword",
      },
    });
    const response = await loginPost(request);

    expect(response.status).toBe(401);
  });

  it("should return 401 with wrong password", async () => {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("correctpassword", 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user123",
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    });

    const request = createRequest("/api/auth/login", {
      method: "POST",
      body: {
        email: "admin@example.com",
        password: "wrongpassword",
      },
    });
    const response = await loginPost(request);

    expect(response.status).toBe(401);
  });

  it("should return tokens with valid credentials", async () => {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user123",
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    });

    const request = createRequest("/api/auth/login", {
      method: "POST",
      body: {
        email: "admin@example.com",
        password: "admin123",
      },
    });
    const response = await loginPost(request);
    const data = (await response.json()) as { user: { email: string } };

    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe("admin@example.com");
  });

  it("should set cookies with tokens", async () => {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user123",
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    });

    const request = createRequest("/api/auth/login", {
      method: "POST",
      body: {
        email: "admin@example.com",
        password: "admin123",
      },
    });
    const response = await loginPost(request);

    expect(response.status).toBe(200);
    expect(response.cookies.get("accessToken")).toBeDefined();
    expect(response.cookies.get("refreshToken")).toBeDefined();
  });

  it("should handle server error", async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error("DB error"));

    const request = createRequest("/api/auth/login", {
      method: "POST",
      body: {
        email: "admin@example.com",
        password: "admin123",
      },
    });
    const response = await loginPost(request);

    expect(response.status).toBe(500);
  });
});

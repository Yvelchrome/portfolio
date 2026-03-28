import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAuthRequest,
  createRequest,
} from "tests/__mocks__/createMockRequest";

import {
  GET as messagesGet,
  POST as messagesPost,
} from "app/api/admin/messages/route";
import { signAccessToken } from "lib/auth/jwt";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    message: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("lib/prisma/prisma", () => ({
  prisma: mockPrisma,
}));

const adminToken = signAccessToken({
  sub: "admin123",
  email: "admin@example.com",
  role: "ADMIN",
});

describe("GET /api/admin/messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 without token", async () => {
    const request = createRequest("/api/admin/messages");
    const response = await messagesGet(request);
    expect(response.status).toBe(401);
  });

  it("should return messages list with valid token", async () => {
    const mockMessages = [
      {
        id: "msg1",
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        content: "Test content",
        status: "NEW",
        readAt: null,
        createdAt: new Date(),
      },
    ];

    mockPrisma.message.findMany.mockResolvedValue(mockMessages);
    mockPrisma.message.count.mockResolvedValue(1);

    const request = createAuthRequest("/api/admin/messages", adminToken);
    const response = await messagesGet(request);
    const data = (await response.json()) as {
      messages: Array<{
        id: string;
        name: string;
        email: string;
        subject: string;
        content: string;
        status: string;
        readAt: Date | null;
        createdAt: Date;
      }>;
    };

    expect(response.status).toBe(200);
    expect(data.messages).toBeDefined();
    expect(Array.isArray(data.messages)).toBe(true);
  });

  it("should filter by status", async () => {
    mockPrisma.message.findMany.mockResolvedValue([]);
    mockPrisma.message.count.mockResolvedValue(0);

    const request = createAuthRequest(
      "/api/admin/messages?status=NEW",
      adminToken,
    );
    const response = await messagesGet(request);

    expect(response.status).toBe(200);
    expect(mockPrisma.message.findMany).toHaveBeenCalled();
  });

  it("should support pagination with cursor", async () => {
    const mockMessages = Array.from({ length: 5 }, (_, i) => ({
      id: `msg${String(i)}`,
      name: `User ${String(i)}`,
      email: `user${String(i)}@example.com`,
      subject: `Subject ${String(i)}`,
      content: `Content ${String(i)}`,
      status: "NEW",
      readAt: null,
      createdAt: new Date(),
    }));

    mockPrisma.message.findMany.mockResolvedValue(mockMessages);

    const request = createAuthRequest(
      "/api/admin/messages?limit=5&cursor=msg10",
      adminToken,
    );
    const response = await messagesGet(request);

    expect(response.status).toBe(200);
  });

  it("should return demo messages in demo mode", async () => {
    const request = createAuthRequest("/api/admin/messages?demo=1", adminToken);
    const response = await messagesGet(request);
    const data = (await response.json()) as { messages: Array<unknown> };

    expect(response.status).toBe(200);
    expect(data.messages).toBeDefined();
    expect(data.messages.length).toBeGreaterThan(0);
  });

  it("should return all messages when status filter is invalid", async () => {
    mockPrisma.message.findMany.mockResolvedValue([]);

    const request = createAuthRequest(
      "/api/admin/messages?status=INVALID_STATUS",
      adminToken,
    );
    const response = await messagesGet(request);

    expect(response.status).toBe(200);
    // Verify findMany was called (invalid status should be ignored)
    expect(mockPrisma.message.findMany).toHaveBeenCalled();
    const callArgs = mockPrisma.message.findMany.mock.calls[0]?.[0] as
      | { where?: { status?: string } }
      | undefined;
    expect(callArgs?.where?.status).toBeUndefined();
  });

  it("should handle demo mode with cursor not found", async () => {
    const request = createAuthRequest(
      "/api/admin/messages?demo=1&cursor=nonexistent-cursor",
      adminToken,
    );
    const response = await messagesGet(request);
    const data = (await response.json()) as { messages: Array<unknown> };

    expect(response.status).toBe(200);
    expect(data.messages).toBeDefined();
    expect(data.messages.length).toBe(20);
  });

  it("should handle server error", async () => {
    mockPrisma.message.findMany.mockRejectedValue(new Error("DB error"));

    const request = createAuthRequest("/api/admin/messages", adminToken);
    const response = await messagesGet(request);

    expect(response.status).toBe(500);
  });

  it("should handle demo mode with cursor pagination", async () => {
    const request = createAuthRequest(
      "/api/admin/messages?demo=1&cursor=demo-50",
      adminToken,
    );
    const response = await messagesGet(request);
    const data = (await response.json()) as { messages: Array<unknown> };

    expect(response.status).toBe(200);
    expect(data.messages).toBeDefined();
  });
});

describe("POST /api/admin/messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 without token", async () => {
    const request = createRequest("/api/admin/messages", {
      method: "POST",
      body: {
        name: "Test",
        email: "test@example.com",
        subject: "Test",
        content: "Test content",
      },
    });
    const response = await messagesPost(request);
    expect(response.status).toBe(401);
  });

  it("should create message with valid data", async () => {
    const mockMessage = {
      id: "newmsg123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      createdAt: new Date(),
    };

    mockPrisma.message.create.mockResolvedValue(mockMessage);

    const request = createAuthRequest("/api/admin/messages", adminToken, {
      method: "POST",
      body: {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        content: "Test content",
      },
    });
    const response = await messagesPost(request);

    expect(response.status).toBe(201);
  });

  it("should return 500 with invalid data", async () => {
    const request = createAuthRequest("/api/admin/messages", adminToken, {
      method: "POST",
      body: {
        name: "",
        email: "invalid-email",
        subject: "Test",
        content: "Test content",
      },
    });
    const response = await messagesPost(request);

    expect(response.status).toBe(500);
  });

  it("should handle server error", async () => {
    mockPrisma.message.create.mockRejectedValue(new Error("DB error"));

    const request = createAuthRequest("/api/admin/messages", adminToken, {
      method: "POST",
      body: {
        name: "Test",
        email: "test@example.com",
        subject: "Test",
        content: "Test content",
      },
    });
    const response = await messagesPost(request);

    expect(response.status).toBe(500);
  });
});

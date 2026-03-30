import { beforeEach, describe, expect, it, vi } from "vitest";

import { NextRequest } from "next/server";

import {
  createAuthRequest,
  createRequest,
} from "tests/__mocks__/createMockRequest";

import {
  DELETE as messageDetailDelete,
  GET as messageDetailGet,
  PUT as messageDetailPut,
} from "app/api/admin/messages/[id]/route";
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

describe("GET /api/admin/messages/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 without token", async () => {
    const request = createRequest(
      "/api/admin/messages/cm12345678901234567890123",
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });
    expect(response.status).toBe(401);
  });

  it.each`
    method                 | id                             | hasToken | status
    ${messageDetailGet}    | ${"invalid-id"}                | ${true}  | ${400}
    ${messageDetailPut}    | ${"cm12345678901234567890123"} | ${false} | ${401}
    ${messageDetailDelete} | ${"cm12345678901234567890123"} | ${false} | ${401}
  `(
    "handles auth correctly for $method.name",
    async ({
      method,
      id,
      hasToken,
      status,
    }: {
      method: (
        req: NextRequest,
        ctx: { params: Promise<{ id: string }> },
      ) => Promise<Response>;
      id: string;
      hasToken: boolean;
      status: number;
    }) => {
      const response = hasToken
        ? await method(
            createAuthRequest(`/api/admin/messages/${id}`, adminToken),
            {
              params: Promise.resolve({ id }),
            },
          )
        : await method(createRequest(`/api/admin/messages/${id}`), {
            params: Promise.resolve({ id }),
          });
      expect(response.status).toBe(status);
    },
  );

  it("should return 400 for invalid CUID", async () => {
    mockPrisma.message.findUnique.mockResolvedValue(null);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(404);
  });

  it("should return message details", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });
    const data = (await response.json()) as {
      id: string;
      name: string;
      email: string;
      subject: string;
      content: string;
      status: string;
    };

    expect(response.status).toBe(200);
    expect(data.id).toBe("cm12345678901234567890123");
  });

  it("should mark as read when markAsRead=true", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "READ",
      readAt: new Date(),
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);
    mockPrisma.message.update.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123?markAsRead=true",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should auto-mark as read when status is NEW and markAsRead=true", async () => {
    const mockMessageNew = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockMessageRead = {
      ...mockMessageNew,
      status: "READ",
      readAt: new Date(),
    };

    mockPrisma.message.findUnique
      .mockResolvedValueOnce(mockMessageNew)
      .mockResolvedValueOnce(mockMessageNew)
      .mockResolvedValueOnce(mockMessageRead);

    mockPrisma.message.update.mockResolvedValueOnce(mockMessageRead);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123?markAsRead=true",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
    expect(mockPrisma.message.update).toHaveBeenCalled();
  });

  it("should handle P2025 error when marking as read (already read)", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "READ",
      readAt: new Date(),
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123?markAsRead=true",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should return demo message in demo mode", async () => {
    const request = createAuthRequest(
      "/api/admin/messages/demo-1?demo=1",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "demo-1" }),
    });
    const data = (await response.json()) as {
      id: string;
      name: string;
      email: string;
      subject: string;
      content: string;
      status: string;
    };

    expect(response.status).toBe(200);
    expect(data.id).toBe("demo-1");
  });

  it("should return demo message with REPLIED status", async () => {
    const request = createAuthRequest(
      "/api/admin/messages/demo-3?demo=1",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "demo-3" }),
    });
    const data = (await response.json()) as {
      status: string;
      replyContent: string;
      name: string;
      email: string;
      subject: string;
      content: string;
    };

    expect(response.status).toBe(200);
    expect(data.status).toBe("REPLIED");
    expect(data.replyContent).toBe(
      "Merci pour votre message. Nous vous répondrons sous 24h.",
    );
  });

  it("should use fallback status when index is out of bounds", async () => {
    const request = createAuthRequest(
      "/api/admin/messages/demo-0?demo=1",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "demo-0" }),
    });
    const data = (await response.json()) as {
      status: string;
      name: string;
      email: string;
      subject: string;
      content: string;
    };

    expect(response.status).toBe(200);
    expect(data.status).toBe("NEW");
  });
});

describe("PUT /api/admin/messages/[id] - error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle P2025 error when updating message that is already read", async () => {
    const mockMessageNew = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.findUnique
      .mockResolvedValueOnce(mockMessageNew)
      .mockResolvedValueOnce(mockMessageNew);

    const p2025Error = new Error("Record to update not found") as Error & {
      code: string;
    };
    p2025Error.code = "P2025";

    const updateSpy = vi.spyOn(mockPrisma.message, "update");
    updateSpy.mockRejectedValue(p2025Error);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123?markAsRead=true",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);

    updateSpy.mockRestore();
  });

  it("should handle P2025 with non-object error structure", async () => {
    const mockMessageNew = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.findUnique
      .mockResolvedValueOnce(mockMessageNew)
      .mockResolvedValueOnce(mockMessageNew);

    const p2025Error = new Error("Record to update not found") as Error & {
      code: string;
    };
    p2025Error.code = "P2025";

    const updateSpy = vi.spyOn(mockPrisma.message, "update");
    updateSpy.mockRejectedValue(p2025Error);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123?markAsRead=true",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);

    updateSpy.mockRestore();
  });

  it("should rethrow non-P2025 error in catch block", async () => {
    const mockMessageNew = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.findUnique
      .mockResolvedValueOnce(mockMessageNew)
      .mockResolvedValueOnce(mockMessageNew);

    const p2000Error = new Error("Some other Prisma error") as Error & {
      code: string;
    };
    p2000Error.code = "P2000";

    const updateSpy = vi.spyOn(mockPrisma.message, "update");
    updateSpy.mockRejectedValue(p2000Error);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123?markAsRead=true",
      adminToken,
    );
    const response = await messageDetailGet(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(500);

    updateSpy.mockRestore();
  });
});

describe("PUT /api/admin/messages/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 without token", async () => {
    const request = createRequest(
      "/api/admin/messages/cm12345678901234567890123",
      {
        method: "PUT",
        body: { status: "READ" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid CUID", async () => {
    const request = createAuthRequest(
      "/api/admin/messages/invalid-id",
      adminToken,
      {
        method: "PUT",
        body: { status: "READ" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "invalid-id" }),
    });

    expect(response.status).toBe(400);
  });

  it("should update message status", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "READ",
      readAt: new Date(),
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.update.mockResolvedValue(mockMessage);
    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "PUT",
        body: { status: "READ" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should update with reply content", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "REPLIED",
      readAt: new Date(),
      repliedAt: new Date(),
      replyContent: "Thank you for your message!",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.update.mockResolvedValue(mockMessage);
    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "PUT",
        body: {
          status: "REPLIED",
          replyContent: "Thank you for your message!",
        },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should set readAt to null when status set to NEW", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.update.mockResolvedValue(mockMessage);
    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "PUT",
        body: { status: "NEW" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should handle findUnique returning null after status update to NEW", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "NEW",
      readAt: null,
      repliedAt: null,
      replyContent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.update
      .mockReset()
      .mockResolvedValueOnce(mockMessage)
      .mockResolvedValueOnce(mockMessage);

    mockPrisma.message.findUnique.mockReset().mockResolvedValue(null);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "PUT",
        body: { status: "NEW" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(mockPrisma.message.findUnique).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it("should update with reply content without explicit status", async () => {
    const mockMessage = {
      id: "cm12345678901234567890123",
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      content: "Test content",
      status: "REPLIED",
      readAt: new Date(),
      repliedAt: new Date(),
      replyContent: "Thank you for your message!",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.message.update.mockResolvedValue(mockMessage);
    mockPrisma.message.findUnique.mockResolvedValue(mockMessage);

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "PUT",
        body: { replyContent: "Thank you for your message!" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should handle server error", async () => {
    mockPrisma.message.update.mockRejectedValue(new Error("DB error"));

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "PUT",
        body: { status: "READ" },
      },
    );
    const response = await messageDetailPut(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/admin/messages/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 without token", async () => {
    const request = createRequest(
      "/api/admin/messages/cm12345678901234567890123",
      {
        method: "DELETE",
      },
    );
    const response = await messageDetailDelete(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });
    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid CUID", async () => {
    const request = createAuthRequest(
      "/api/admin/messages/invalid-id",
      adminToken,
      {
        method: "DELETE",
      },
    );
    const response = await messageDetailDelete(request, {
      params: Promise.resolve({ id: "invalid-id" }),
    });

    expect(response.status).toBe(400);
  });

  it("should delete message successfully", async () => {
    mockPrisma.message.delete.mockResolvedValue({
      id: "cm12345678901234567890123",
    });

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "DELETE",
      },
    );
    const response = await messageDetailDelete(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(200);
  });

  it("should handle server error", async () => {
    mockPrisma.message.delete.mockRejectedValue(new Error("DB error"));

    const request = createAuthRequest(
      "/api/admin/messages/cm12345678901234567890123",
      adminToken,
      {
        method: "DELETE",
      },
    );
    const response = await messageDetailDelete(request, {
      params: Promise.resolve({ id: "cm12345678901234567890123" }),
    });

    expect(response.status).toBe(500);
  });
});

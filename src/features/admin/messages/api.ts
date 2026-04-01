import {
  type MessageDetail,
  MessageDetailSchema,
  type MessageStats,
  MessageStatsSchema,
  type MessagesResponse,
  MessagesResponseSchema,
  parseJsonWithZod,
} from "lib/schemas";

const API_BASE = "/api/admin/messages";

export async function getMessageStats(isDemo = false): Promise<MessageStats> {
  const searchParams = new URLSearchParams();
  if (isDemo) searchParams.set("demo", "1");

  const response = await fetch(`${API_BASE}/stats?${searchParams}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch message stats");
  }

  return parseJsonWithZod(response, MessageStatsSchema);
}

export async function getMessages(params: {
  cursor?: string | undefined;
  limit?: number;
  status?: string | undefined;
  isDemo?: boolean;
}): Promise<MessagesResponse> {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.status) searchParams.set("status", params.status);
  if (params.isDemo) searchParams.set("demo", "1");

  const response = await fetch(`${API_BASE}?${searchParams}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return parseJsonWithZod(response, MessagesResponseSchema);
}

export async function getMessage(
  id: string,
  isDemo = false,
  markAsRead = true,
): Promise<MessageDetail> {
  const searchParams = new URLSearchParams();
  searchParams.set("markAsRead", String(markAsRead));
  if (isDemo) searchParams.set("demo", "1");

  const response = await fetch(`${API_BASE}/${id}?${searchParams}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch message");
  }

  return parseJsonWithZod(response, MessageDetailSchema);
}

export async function updateMessage(
  id: string,
  data: { status?: string; replyContent?: string },
): Promise<MessageDetail> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update message");
  }

  return parseJsonWithZod(response, MessageDetailSchema);
}

export async function deleteMessage(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete message");
  }
}

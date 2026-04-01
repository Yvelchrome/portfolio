import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "lib/auth/middleware";
import { prisma } from "lib/prisma/prisma";
import {
  CreateMessageSchema,
  type MessageStatus,
  MessageStatusEnum,
} from "lib/schemas";

type DemoMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: MessageStatus;
  readAt: string | null;
  createdAt: string;
};

function generateDemoMessages(limit: number): DemoMessage[] {
  const messages: DemoMessage[] = [];
  const now = new Date();

  for (let i = 0; i < limit; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    messages.push({
      id: `demo-${String(i + 1)}`,
      name: `Utilisateur Test ${String(i + 1)}`,
      email: `test${String(i + 1)}@exemple.com`,
      subject: `Sujet du message de test ${String(i + 1)}`,
      content: `Ceci est le message de test numéro ${String(i + 1)}.\n\nBonjour, je souhaite avoir des informations sur vos services. Merci de me contacter.`,
      status: ["NEW", "READ", "REPLIED", "ARCHIVED"][
        i % 4
      ] as DemoMessage["status"],
      readAt: null,
      createdAt: date.toISOString(),
    });
  }

  return messages;
}

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const isDemo = searchParams.get("demo") === "1";

    const where: { status?: MessageStatus; id?: { lt: string } } = {};
    if (status) {
      const parsedStatus = MessageStatusEnum.safeParse(status);
      if (parsedStatus.success) {
        where.status = parsedStatus.data;
      }
    }

    if (cursor) {
      where.id = { lt: cursor };
    }

    let messages;
    let nextCursor: string | undefined;

    if (isDemo) {
      messages = generateDemoMessages(67);

      if (where.status) {
        messages = messages.filter((msg) => msg.status === where.status);
      }

      if (cursor) {
        const cursorIndex = messages.findIndex((m) => m.id === cursor);
        if (cursorIndex !== -1) {
          messages = messages.slice(cursorIndex);
        }
      }
    } else {
      messages = await prisma.message.findMany({
        where,
        take: limit + 1, // Fetch one extra to determine if there's a next page
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });
    }

    const hasNextPage: boolean = messages.length > limit;
    if (hasNextPage) {
      nextCursor = messages[limit]?.id;
    }
    messages = messages.slice(0, limit);

    const serializedMessages = messages.map((msg) => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      content: msg.content,
      status: msg.status,
      readAt: msg.readAt,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({
      messages: serializedMessages,
      pagination: hasNextPage
        ? { cursor: nextCursor, limit, hasNextPage }
        : { limit, hasNextPage: false },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body: unknown = await request.json();
    const parsedBody = CreateMessageSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        ...parsedBody,
        status: "NEW",
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

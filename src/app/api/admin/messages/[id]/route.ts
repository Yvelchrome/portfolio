import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "lib/auth/middleware";
import { prisma } from "lib/prisma/prisma";
import {
  IdParamSchema,
  type MessageStatus,
  UpdateMessageSchema,
} from "lib/schemas";

type DemoMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: MessageStatus;
  readAt: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  replyContent: string | null;
};

function generateDemoMessage(id: string): DemoMessage {
  const now = new Date();
  const statuses: MessageStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];
  // Use same logic as list: index = (id - 1) % 4
  const statusIndex = (parseInt(id.replace("demo-", "")) - 1) % 4;
  const status = statuses[statusIndex] ?? "NEW";

  return {
    id,
    name: `Utilisateur Test ${id.replace("demo-", "")}`,
    email: `test${id.replace("demo-", "")}@exemple.com`,
    subject: `Sujet du message de test ${id.replace("demo-", "")}`,
    content: `Ceci est le message de test numéro ${id.replace("demo-", "")}.\n\nBonjour, je souhaite avoir des informations sur vos services. Merci de me contacter à cette adresse email. Je suis感兴趣 par vos offres.`,
    status,
    readAt: status !== "NEW" ? now.toISOString() : null,
    repliedAt: status === "REPLIED" ? now.toISOString() : null,
    createdAt: new Date(
      now.getTime() - parseInt(id.replace("demo-", "")) * 3600000,
    ).toISOString(),
    updatedAt: now.toISOString(),
    replyContent:
      status === "REPLIED"
        ? "Merci pour votre message. Nous vous répondrons sous 24h."
        : null,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const markAsRead = searchParams.get("markAsRead") === "true";
    const isDemo = searchParams.get("demo") === "1";

    // Demo mode: return mock message (before validation since demo IDs aren't CUIDs)
    if (isDemo) {
      return NextResponse.json(generateDemoMessage(id));
    }

    const validation = IdParamSchema.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    let message;
    if (markAsRead) {
      const existingMessage = await prisma.message.findUnique({
        where: { id },
        select: { status: true, readAt: true, updatedAt: true },
      });

      const shouldAutoMarkAsRead = existingMessage?.status === "NEW";
      if (shouldAutoMarkAsRead) {
        // Atomic update: update and return in a single transaction
        message = await prisma.message
          .update({
            where: {
              id,
              status: "NEW",
            },
            data: {
              status: "READ",
              readAt: new Date(),
            },
          })
          .catch(async (error: unknown) => {
            // If update didn't match (status already READ), just fetch the message
            if (
              typeof error === "object" &&
              error !== null &&
              "code" in error &&
              (error as { code: string }).code === "P2025"
            ) {
              return prisma.message.findUnique({
                where: { id },
              });
            }
            throw error;
          });
      } else {
        message = await prisma.message.findUnique({
          where: { id },
        });
      }
    } else {
      message = await prisma.message.findUnique({
        where: { id },
      });
    }

    if (!message) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...message,
      readAt: message.readAt?.toISOString() ?? null,
      repliedAt: message.repliedAt?.toISOString() ?? null,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const parsedBody = UpdateMessageSchema.parse(body);
    const { status, replyContent } = parsedBody;

    const updateData = {
      ...(status && { status }),
      ...(replyContent !== undefined && {
        replyContent,
        repliedAt: new Date(),
        repliedBy: {
          connect: { id: authResult.user.sub },
        },
        status: status ?? "REPLIED",
      }),
    };

    const validation = IdParamSchema.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    let message = await prisma.message.update({
      where: { id },
      data: updateData,
    });

    if (status === "NEW") {
      await prisma.message.update({
        where: { id },
        data: { readAt: null },
      });
      const updatedMessage = await prisma.message.findUnique({
        where: { id },
      });
      if (updatedMessage) {
        message = updatedMessage;
      }
    }

    return NextResponse.json({
      ...message,
      readAt: message.readAt?.toISOString() ?? null,
      repliedAt: message.repliedAt?.toISOString() ?? null,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { id } = await params;

    const validation = IdParamSchema.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

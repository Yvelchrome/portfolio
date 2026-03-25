import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "lib/auth/middleware";
import { prisma } from "lib/prisma/prisma";

function generateDemoStats(): {
  total: number;
  unread: number;
  replied: number;
} {
  return {
    total: 127,
    unread: 23,
    replied: 84,
  };
}

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const isDemo = searchParams.get("demo") === "1";

    if (isDemo) {
      return NextResponse.json(generateDemoStats());
    }

    const [total, unread, replied] = await Promise.all([
      prisma.message.count(),
      prisma.message.count({ where: { status: "NEW" } }),
      prisma.message.count({ where: { status: "REPLIED" } }),
    ]);

    return NextResponse.json({
      total,
      unread,
      replied,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

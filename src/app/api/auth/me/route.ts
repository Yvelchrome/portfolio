import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "lib/auth/middleware";
import { prisma } from "lib/prisma/prisma";

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

import { JWTPayload, verifyAccessToken } from "./jwt";

export function requireAuth(
  request: NextRequest,
): { user: JWTPayload } | NextResponse {
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - No token provided" },
      { status: 401 },
    );
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid or expired token" },
      { status: 401 },
    );
  }

  return { user: payload };
}

export function requireAdmin(
  request: NextRequest,
): { user: JWTPayload } | NextResponse {
  const authResult = requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (authResult.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 },
    );
  }

  return authResult;
}

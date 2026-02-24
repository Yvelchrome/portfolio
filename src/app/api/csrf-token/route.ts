"use server";

import { CSRFResponseSchema } from "lib/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env["CSRF_SECRET"] ?? null;

  const data = CSRFResponseSchema.parse({ csrfToken: token });

  return NextResponse.json(data);
}

"use server";

import { NextResponse } from "next/server";

import { CSRFResponseSchema } from "lib/schemas";

export async function GET() {
  const token = process.env["CSRF_SECRET"] ?? null;

  await Promise.resolve();

  const data = CSRFResponseSchema.parse({ csrfToken: token });

  return NextResponse.json(data);
}

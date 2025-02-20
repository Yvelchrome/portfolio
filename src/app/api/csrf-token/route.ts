"use server";

import { NextResponse } from "next/server";

export async function GET(): Promise<
  NextResponse<{ token: string | undefined }>
> {
  return NextResponse.json({
    token: process.env.CSRF_SECRET,
  });
}

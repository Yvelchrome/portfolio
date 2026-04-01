import { NextRequest, NextResponse } from "next/server";

import { compare } from "bcryptjs";

import { signAccessToken, signRefreshToken } from "lib/auth/jwt";
import { prisma } from "lib/prisma/prisma";
import { LoginCredentialsSchema } from "lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { email, password } = LoginCredentialsSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "refresh",
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

import jwt from "jsonwebtoken";

import { JWTPayloadSchema, RefreshPayloadSchema } from "lib/schemas";

// Validate that JWT secrets are properly configured at startup
const rawJwtSecret = process.env["JWT_SECRET"];
const rawJwtRefreshSecret = process.env["JWT_REFRESH_SECRET"];

if (!rawJwtSecret) {
  throw new Error("JWT_SECRET environment variable is required but not set");
}

if (!rawJwtRefreshSecret) {
  throw new Error(
    "JWT_REFRESH_SECRET environment variable is required but not set",
  );
}

if (rawJwtSecret === rawJwtRefreshSecret) {
  throw new Error(
    "JWT_SECRET and JWT_REFRESH_SECRET must have different values",
  );
}

if (rawJwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

if (rawJwtRefreshSecret.length < 32) {
  throw new Error("JWT_REFRESH_SECRET must be at least 32 characters long");
}

// Type-safe secrets after validation
const JWT_SECRET: string = rawJwtSecret;
const JWT_REFRESH_SECRET: string = rawJwtRefreshSecret;

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number | undefined;
  exp?: number | undefined;
}

export interface RefreshPayload extends JWTPayload {
  type: "refresh";
}

export const ACCESS_TOKEN_EXPIRY = "30m";
export const REFRESH_TOKEN_EXPIRY = "1d";

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: RefreshPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const payload = JWTPayloadSchema.parse(decoded);
    return payload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const payload = RefreshPayloadSchema.parse(decoded);
    return payload;
  } catch {
    return null;
  }
}

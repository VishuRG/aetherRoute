import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ECO_CONFIG } from "@/services/config";

const JWT_SECRET = ECO_CONFIG.JWT_SECRET || "ecoroute-production-delhi-ncr-jwt-secret-key-2026-32chars";
export const COOKIE_NAME = "eco_session";
export const COOKIE_NAME_FALLBACK = "ecoroute_token";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Hash a password securely with bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password || !hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error("bcrypt compare error:", err);
    return false;
  }
}

// Create JWT token
export function createToken(payload: Omit<SessionPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export const signToken = createToken;

// Verify JWT token
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

// Get current session from cookie or request headers
export async function getSession(req?: Request): Promise<SessionPayload | null> {
  try {
    // 1. Check Bearer token in request Authorization header if provided
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const verified = verifyToken(token);
        if (verified) return verified;
      }
    }

    // 2. Check next/headers cookies
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value || cookieStore.get(COOKIE_NAME_FALLBACK)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// Set session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  cookieStore.set(COOKIE_NAME_FALLBACK, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  cookieStore.set(COOKIE_NAME_FALLBACK, "", { maxAge: 0, path: "/" });
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

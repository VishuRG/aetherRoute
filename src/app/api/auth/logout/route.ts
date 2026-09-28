import { NextResponse } from "next/server";
import { COOKIE_NAME, COOKIE_NAME_FALLBACK } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set(COOKIE_NAME_FALLBACK, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

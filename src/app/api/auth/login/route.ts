import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Try finding user in database or use default demo user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user on the fly for seamless demo experience
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: "demo_hashed_password",
          name: email.split("@")[0] || "Eco Commuter",
          profile: {
            create: {
              city: "Delhi",
              state: "Delhi",
            },
          },
        },
      });
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set("ecoroute_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

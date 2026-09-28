import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME, COOKIE_NAME_FALLBACK } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, mobile } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists in SQL database
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(mobile ? [{ mobile: mobile.trim() }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or mobile already exists" },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    // Save user in SQLite database with initialized profile & eco streak
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: name.trim(),
        mobile: mobile ? mobile.trim() : null,
        passwordHash,
        role: "user",
        isVerified: true,
        profile: {
          create: {
            city: "Delhi",
            state: "Delhi",
            homeAddress: "Delhi NCR",
          },
        },
        travelPreferences: {
          create: {
            preferredMode: "Metro",
            maxWalkingMinutes: 15,
            maxBudgetPerDay: 200,
            ecoPreference: true,
          },
        },
        ecoStreaks: {
          create: {
            currentDays: 1,
            longestDays: 1,
            totalCo2Saved: 0,
            totalEcoTrips: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Create session token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });

    // Set HTTP-only auth cookies
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    };

    response.cookies.set(COOKIE_NAME, token, cookieOptions);
    response.cookies.set(COOKIE_NAME_FALLBACK, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during registration" },
      { status: 500 }
    );
  }
}

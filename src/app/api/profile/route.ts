import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { resolveLocation } from "@/lib/locations";

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    let userId = session?.userId;

    if (!userId) {
      const firstUser = await prisma.user.findFirst();
      userId = firstUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        savedLocations: { orderBy: { createdAt: "desc" } },
        travelPreferences: true,
        emergencyContacts: true,
        ecoStreaks: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, mobile, bio, homeAddress, workAddress, collegeAddress, city } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name ? { name } : {}),
        ...(mobile ? { mobile } : {}),
        profile: {
          upsert: {
            create: {
              bio,
              homeAddress,
              workAddress,
              collegeAddress,
              city: city || "Delhi",
            },
            update: {
              ...(bio !== undefined ? { bio } : {}),
              ...(homeAddress !== undefined ? { homeAddress } : {}),
              ...(workAddress !== undefined ? { workAddress } : {}),
              ...(collegeAddress !== undefined ? { collegeAddress } : {}),
              ...(city !== undefined ? { city } : {}),
            },
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    let userId = session?.userId;
    if (!userId) {
      const firstUser = await prisma.user.findFirst();
      userId = firstUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { label, name, address, lat, lng, icon } = body;

    const loc = resolveLocation(address || name, lat, lng);

    const saved = await prisma.savedLocation.create({
      data: {
        userId,
        label: label || "Favorite Place",
        name: name || loc.name,
        address: address || loc.name,
        lat: loc.lat,
        lng: loc.lng,
        icon: icon || "📍",
        isFavourite: true,
      },
    });

    return NextResponse.json({ message: "Location saved successfully", location: saved });
  } catch (error) {
    console.error("Save location error:", error);
    return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "PATIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { patientProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      birthday: user.patientProfile?.birthday,
      weight: user.patientProfile?.weight,
      height: user.patientProfile?.height,
      bloodType: user.patientProfile?.bloodType,
      allergies: user.patientProfile?.allergies,
      medicalHistory: user.patientProfile?.medicalHistory,
      contactPhone: user.patientProfile?.contactPhone,
      address: user.patientProfile?.address,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "PATIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      birthday,
      weight,
      height,
      bloodType,
      allergies,
      medicalHistory,
      contactPhone,
      address,
    } = body;

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name,
        patientProfile: {
          upsert: {
            create: {
              birthday: birthday ? new Date(birthday) : null,
              weight: weight ? parseFloat(weight) : null,
              height: height ? parseFloat(height) : null,
              bloodType,
              allergies,
              medicalHistory,
              contactPhone,
              address,
            },
            update: {
              birthday: birthday ? new Date(birthday) : null,
              weight: weight ? parseFloat(weight) : null,
              height: height ? parseFloat(height) : null,
              bloodType,
              allergies,
              medicalHistory,
              contactPhone,
              address,
            },
          },
        },
      },
    });

    return NextResponse.json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

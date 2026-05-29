import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { doctorProfile: true },
    });

    if (!userData) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: userData.name,
      specialization: userData.doctorProfile?.specialization,
      bio: userData.doctorProfile?.bio,
      experience: userData.doctorProfile?.experience,
      education: userData.doctorProfile?.education,
      licenseNumber: userData.doctorProfile?.licenseNumber,
      consultationFee: userData.doctorProfile?.consultationFee,
    });
  } catch (error) {
    console.error("Get doctor profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      specialization,
      bio,
      experience,
      education,
      licenseNumber,
      consultationFee,
    } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        doctorProfile: {
          upsert: {
            create: {
              specialization,
              bio,
              experience: experience ? parseInt(experience) : undefined,
              education,
              licenseNumber,
              consultationFee: consultationFee
                ? parseFloat(consultationFee)
                : undefined,
            },
            update: {
              specialization,
              bio,
              experience: experience ? parseInt(experience) : undefined,
              education,
              licenseNumber,
              consultationFee: consultationFee
                ? parseFloat(consultationFee)
                : undefined,
            },
          },
        },
      },
    });

    return NextResponse.json({ message: "Profile updated", user: updated });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

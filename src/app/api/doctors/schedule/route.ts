import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - Fetch doctor's schedule
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
      include: { availabilities: true },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(doctorProfile.availabilities);
  } catch (error) {
    console.error("Get schedule error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 },
    );
  }
}

// POST - Add availability
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { dayOfWeek, startTime, endTime } = body;

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 },
      );
    }

    const availability = await prisma.availability.create({
      data: {
        doctorId: doctorProfile.id,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        isAvailable: true,
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error("Create schedule error:", error);
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 },
    );
  }
}

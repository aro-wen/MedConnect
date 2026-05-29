import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: id },
      include: { availabilities: true },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctorProfile.availabilities);
  } catch (error) {
    console.error("Get availability error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}

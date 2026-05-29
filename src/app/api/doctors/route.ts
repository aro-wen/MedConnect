import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      include: {
        doctorProfile: {
          include: {
            availabilities: true,
          },
        },
      },
    });
    return NextResponse.json(doctors);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 },
    );
  }
}

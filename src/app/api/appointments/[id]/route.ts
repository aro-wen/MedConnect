import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 },
    );
  }
}

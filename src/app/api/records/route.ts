import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const where =
      user.role === "DOCTOR" ? { doctorId: user.id } : { patientId: user.id };

    const records = await prisma.medicalRecord.findMany({
      where,
      include: {
        doctor: { select: { name: true } },
        patient: { select: { name: true } },
        appointment: { select: { date: true, time: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { appointmentId, diagnosis, prescription, notes } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    const record = await prisma.medicalRecord.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: user.id,
        diagnosis,
        prescription,
        notes,
      },
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json(record);
  } catch {
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notification-db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { date, time } = await req.json();

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (
      appointment.patientId !== decoded.id &&
      appointment.doctorId !== decoded.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: new Date(date),
        time,
        status: "RESCHEDULED",
      },
    });

    await createNotification(
      appointment.doctorId,
      "Appointment Rescheduled",
      `${appointment.patient.name} rescheduled to ${new Date(date).toLocaleDateString()} at ${time}.`,
    );

    await createNotification(
      appointment.patientId,
      "Appointment Rescheduled",
      `Your appointment is now on ${new Date(date).toLocaleDateString()} at ${time}.`,
    );

    return NextResponse.json({
      message: "Appointment rescheduled",
      appointment: updated,
    });
  } catch (error) {
    console.error("Reschedule error:", error);
    return NextResponse.json(
      { error: "Failed to reschedule" },
      { status: 500 },
    );
  }
}

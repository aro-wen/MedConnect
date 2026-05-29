import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notification-db";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "RESCHEDULED",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: " + VALID_STATUSES.join(", "),
        },
        { status: 400 },
      );
    }

    const existing = await prisma.appointment.findUnique({
      where: { id },
      select: { patientId: true, doctorId: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (existing.patientId !== user.id && existing.doctorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existing.status === "CANCELLED" || existing.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot modify a cancelled or completed appointment" },
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        doctor: { select: { name: true } },
        patient: { select: { name: true } },
      },
    });

    // Notify doctor
    await createNotification(
      appointment.doctorId,
      "New Appointment Request",
      `${appointment.patient.name} booked an appointment for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`,
    );

    // Notify patient
    await createNotification(
      appointment.patientId,
      "Appointment Booked!",
      `Your appointment with ${appointment.doctor.name} is scheduled.`,
    );

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 },
    );
  }
}

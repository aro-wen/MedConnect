import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notification-db";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const where =
      role === "DOCTOR" ? { doctorId: user.id } : { patientId: user.id };

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: { select: { name: true, email: true } },
        patient: { select: { name: true, email: true } },
        record: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
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
    const { doctorId, date, time, symptoms } = body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: user.id,
        doctorId,
        date: new Date(date),
        time,
        symptoms,
        status: "PENDING",
        meetingLink: `https://meet.jit.si/medconnect-${Date.now()}`,
      },
      include: {
        doctor: { select: { name: true, id: true } },
        patient: { select: { name: true, id: true } },
      },
    });

    // Notify doctor about new booking
    await createNotification(
      appointment.doctorId,
      "New Appointment Request",
      `${appointment.patient.name} booked an appointment for ${new Date(date).toLocaleDateString()} at ${time}.`,
    );

    // Notify patient about successful booking
    await createNotification(
      appointment.patientId,
      "Appointment Booked!",
      `Your appointment with ${appointment.doctor.name} is scheduled for ${new Date(date).toLocaleDateString()} at ${time}.`,
    );

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}

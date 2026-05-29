import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role, specialization, bio, experience } =
      body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role === "DOCTOR" ? "DOCTOR" : "PATIENT",
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        patientProfile: role === "PATIENT" ? { create: {} } : undefined,
        doctorProfile:
          role === "DOCTOR"
            ? {
                create: {
                  specialization: specialization || "General Practice",
                  bio: bio || "",
                  experience: experience || 0,
                },
              }
            : undefined,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

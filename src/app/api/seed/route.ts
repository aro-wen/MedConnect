import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const doctors = [
  {
    email: "dr.smith@telehealth.com",
    password: "password123",
    name: "Sarah Smith",
    role: "DOCTOR",
    specialization: "Cardiology",
    bio: "Board-certified cardiologist with 15 years of experience in treating heart conditions and cardiovascular diseases.",
    experience: 15,
    education: "Harvard Medical School",
    licenseNumber: "MD-CARD-12345",
    rating: 4.8,
    consultationFee: 150,
    availabilities: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "14:00" },
    ],
  },
  {
    email: "dr.johnson@telehealth.com",
    password: "password123",
    name: "Michael Johnson",
    role: "DOCTOR",
    specialization: "Neurology",
    bio: "Expert neurologist specializing in headaches, migraines, and nervous system disorders.",
    experience: 12,
    education: "Johns Hopkins University",
    licenseNumber: "MD-NEUR-67890",
    rating: 4.9,
    consultationFee: 180,
    availabilities: [
      { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "16:00" },
    ],
  },
  {
    email: "dr.lee@telehealth.com",
    password: "password123",
    name: "Emily Lee",
    role: "DOCTOR",
    specialization: "Dermatology",
    bio: "Specialist in skin conditions, cosmetic dermatology, and skin cancer screening.",
    experience: 10,
    education: "Stanford Medical School",
    licenseNumber: "MD-DERM-11111",
    rating: 4.7,
    consultationFee: 130,
    availabilities: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 5, startTime: "10:00", endTime: "16:00" },
    ],
  },
  {
    email: "dr.patel@telehealth.com",
    password: "password123",
    name: "Raj Patel",
    role: "DOCTOR",
    specialization: "Pediatrics",
    bio: "Compassionate pediatrician with expertise in child development and preventive care.",
    experience: 8,
    education: "Yale School of Medicine",
    licenseNumber: "MD-PED-22222",
    rating: 4.9,
    consultationFee: 120,
    availabilities: [
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" },
    ],
  },
  {
    email: "dr.garcia@telehealth.com",
    password: "password123",
    name: "Carlos Garcia",
    role: "DOCTOR",
    specialization: "Orthopedics",
    bio: "Orthopedic surgeon specializing in sports injuries, joint replacement, and fracture care.",
    experience: 14,
    education: "UCSF Medical Center",
    licenseNumber: "MD-ORT-33333",
    rating: 4.6,
    consultationFee: 160,
    availabilities: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "15:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "15:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "15:00" },
    ],
  },
  {
    email: "dr.chen@telehealth.com",
    password: "password123",
    name: "Lisa Chen",
    role: "DOCTOR",
    specialization: "Psychiatry",
    bio: "Board-certified psychiatrist focusing on anxiety, depression, and cognitive behavioral therapy.",
    experience: 11,
    education: "Columbia University",
    licenseNumber: "MD-PSY-44444",
    rating: 4.8,
    consultationFee: 170,
    availabilities: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
    ],
  },
  {
    email: "dr.wilson@telehealth.com",
    password: "password123",
    name: "James Wilson",
    role: "DOCTOR",
    specialization: "Gastroenterology",
    bio: "Expert in digestive health, IBD, and liver diseases with advanced endoscopy skills.",
    experience: 13,
    education: "Duke University",
    licenseNumber: "MD-GAS-55555",
    rating: 4.7,
    consultationFee: 155,
    availabilities: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "16:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "16:00" },
    ],
  },
  {
    email: "dr.brown@telehealth.com",
    password: "password123",
    name: "Amanda Brown",
    role: "DOCTOR",
    specialization: "General Practice",
    bio: "Family medicine physician providing comprehensive primary care for all ages.",
    experience: 9,
    education: "University of Michigan",
    licenseNumber: "MD-GP-66666",
    rating: 4.5,
    consultationFee: 100,
    availabilities: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
      { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "18:00" },
    ],
  },
];

export async function POST() {
  try {
    // Clear existing data
    await prisma.availability.deleteMany();
    await prisma.medicalRecord.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.patientProfile.deleteMany();
    await prisma.doctorProfile.deleteMany();
    await prisma.user.deleteMany();

    for (const doc of doctors) {
      const { availabilities, ...userData } = doc;

      await prisma.user.create({
        data: {
          email: userData.email,
          password: hashPassword(userData.password),
          name: userData.name,
          role: userData.role,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
          doctorProfile: {
            create: {
              specialization: userData.specialization,
              bio: userData.bio,
              experience: userData.experience,
              education: userData.education,
              licenseNumber: userData.licenseNumber,
              rating: userData.rating,
              consultationFee: userData.consultationFee,
              availabilities: {
                create: availabilities,
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      count: doctors.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

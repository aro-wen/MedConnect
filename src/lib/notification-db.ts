import { prisma } from "./prisma";

export async function createNotification(
  userId: string,
  title: string,
  body: string,
) {
  try {
    await prisma.notification.create({
      data: { userId, title, body },
    });
  } catch (error) {
    console.error("Create notification error:", error);
  }
}

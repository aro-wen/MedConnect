"use client";

import { toast } from "sonner";

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, unknown>;
}

// Store callbacks for in-app notification system
const callbacks: Set<(title: string, body: string) => void> = new Set();

export function onNotification(cb: (title: string, body: string) => void) {
  callbacks.add(cb);
  return () => callbacks.delete(cb);
}

function notifyInApp(title: string, body: string) {
  callbacks.forEach((cb) => cb(title, body));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendNotification(payload: NotificationPayload): void {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/icon.png",
        data: payload.data,
      });
    } catch {
      // Browser notification failed
    }
  }

  // Always show toast
  toast.success(payload.title, { description: payload.body });

  // Push to in-app notification system
  notifyInApp(payload.title, payload.body);
}

// ─────────────────────────────────────────────
// APPOINTMENT NOTIFICATIONS
// ─────────────────────────────────────────────

export function notifyAppointmentBooked(
  doctorName: string,
  date: string,
  time: string,
): void {
  sendNotification({
    title: "Appointment Booked!",
    body: `Your appointment with ${doctorName} is scheduled for ${formatDate(date)} at ${time}.`,
    icon: "/stethoscope-icon.png",
  });
}

export function notifyAppointmentCancelled(
  doctorName: string,
  date: string,
  time: string,
): void {
  sendNotification({
    title: "Appointment Cancelled",
    body: `Your appointment with ${doctorName} on ${formatDate(date)} at ${time} has been cancelled.`,
    icon: "/stethoscope-icon.png",
  });
}

export function notifyAppointmentRescheduled(
  doctorName: string,
  oldDate: string,
  oldTime: string,
  newDate: string,
  newTime: string,
): void {
  sendNotification({
    title: "Appointment Rescheduled",
    body: `Your appointment with ${doctorName} moved from ${formatDate(oldDate)} ${oldTime} to ${formatDate(newDate)} ${newTime}.`,
    icon: "/stethoscope-icon.png",
  });
}

export function notifyStatusConfirmed(
  doctorName: string,
  date: string,
  time: string,
): void {
  sendNotification({
    title: "Appointment Confirmed",
    body: `Your appointment with ${doctorName} on ${formatDate(date)} at ${time} has been confirmed.`,
    icon: "/stethoscope-icon.png",
  });
}

export function notifyStatusCompleted(
  doctorName: string,
  date: string,
  time: string,
): void {
  sendNotification({
    title: "Appointment Completed",
    body: `Your appointment with ${doctorName} on ${formatDate(date)} at ${time} is marked as completed.`,
    icon: "/stethoscope-icon.png",
  });
}

export function notifyStatusPending(
  doctorName: string,
  date: string,
  time: string,
): void {
  sendNotification({
    title: "Appointment Pending",
    body: `Your appointment with ${doctorName} on ${formatDate(date)} at ${time} is awaiting confirmation.`,
    icon: "/stethoscope-icon.png",
  });
}

// ─────────────────────────────────────────────
// REMINDER NOTIFICATIONS
// ─────────────────────────────────────────────

const activeTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

function scheduleReminder(
  key: string,
  appointmentDateTime: Date,
  minutesBefore: number,
  title: string,
  body: string,
): void {
  const reminderTime = new Date(
    appointmentDateTime.getTime() - minutesBefore * 60 * 1000,
  );
  const now = new Date();

  if (reminderTime <= now) return;

  const delay = reminderTime.getTime() - now.getTime();
  const timerKey = `${key}-${minutesBefore}`;

  // Clear existing timer for this key if any
  if (activeTimers.has(timerKey)) {
    clearTimeout(activeTimers.get(timerKey));
  }

  const timer = setTimeout(() => {
    sendNotification({
      title,
      body,
      icon: "/stethoscope-icon.png",
    });
    activeTimers.delete(timerKey);
  }, delay);

  activeTimers.set(timerKey, timer);
}

export function scheduleAllReminders(
  appointmentId: string,
  appointmentDate: string,
  appointmentTime: string,
  doctorName: string,
): void {
  const appointmentDateTime = new Date(
    `${appointmentDate.split("T")[0]}T${appointmentTime}`,
  );

  // 1 day before
  scheduleReminder(
    appointmentId,
    appointmentDateTime,
    24 * 60, // 1440 minutes = 1 day
    "Appointment Tomorrow",
    `Your appointment with ${doctorName} is tomorrow at ${appointmentTime}.`,
  );

  // 1 hour before
  scheduleReminder(
    appointmentId,
    appointmentDateTime,
    60,
    "Appointment in 1 Hour",
    `Your appointment with ${doctorName} is in 1 hour at ${appointmentTime}.`,
  );

  // 30 minutes before
  scheduleReminder(
    appointmentId,
    appointmentDateTime,
    30,
    "Appointment Soon",
    `Your appointment with ${doctorName} is in 30 minutes at ${appointmentTime}.`,
  );
}

export function clearReminders(appointmentId: string): void {
  [24 * 60, 60, 30].forEach((minutes) => {
    const key = `${appointmentId}-${minutes}`;
    if (activeTimers.has(key)) {
      clearTimeout(activeTimers.get(key));
      activeTimers.delete(key);
    }
  });
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

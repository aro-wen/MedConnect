/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Calendar, Video, FileText, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RescheduleDialog } from "@/components/reschedule-dialogue";
import {
  notifyAppointmentCancelled,
  notifyAppointmentRescheduled,
  clearReminders,
  scheduleAllReminders,
} from "@/lib/notifications";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  symptoms: string | null;
  meetingLink: string | null;
  doctor: { name: string; email: string };
  record: { id: string } | null;
}

export default function PatientAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filterStatus, setFilterStatus] = React.useState("ALL");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const fetchAppointments = React.useCallback(async () => {
    try {
      const res = await fetch("/api/appointments?role=PATIENT", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch {
      console.error("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = React.useMemo(() => {
    let result = [...appointments];

    if (filterStatus !== "ALL") {
      result = result.filter((a) => a.status === filterStatus);
    }

    // If filtering confirmed, allow sorting by date+time
    if (filterStatus === "CONFIRMED") {
      result.sort((a, b) => {
        const da = new Date(`${a.date}T${a.time}`);
        const db = new Date(`${b.date}T${b.time}`);
        return sortOrder === "asc"
          ? da.getTime() - db.getTime()
          : db.getTime() - da.getTime();
      });
    }

    return result;
  }, [appointments, filterStatus, sortOrder]);

  const handleCancel = async (id: string) => {
    try {
      const apt = appointments.find((a) => a.id === id);
      if (!apt) return;

      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (res.ok) {
        clearReminders(id);
        notifyAppointmentCancelled(apt.doctor.name, apt.date, apt.time);
        toast.success("Appointment cancelled");
        fetchAppointments();
      }
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const handleReschedule = (
    apt: Appointment,
    newDate: string,
    newTime: string,
  ) => {
    clearReminders(apt.id);
    notifyAppointmentRescheduled(
      apt.doctor.name,
      apt.date,
      apt.time,
      newDate,
      newTime,
    );
    scheduleAllReminders(apt.id, newDate, newTime, apt.doctor.name);
    fetchAppointments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "RESCHEDULED":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-1">
          View and manage your consultation history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Filter:</label>
              <Select
                onValueChange={(v: string) => setFilterStatus(v)}
                defaultValue="ALL"
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  <SelectItem value="RESCHEDULED">RESCHEDULED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Sort (confirmed):</label>
              <Select
                onValueChange={(v: string) => setSortOrder(v as "asc" | "desc")}
                defaultValue="asc"
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Earliest First</SelectItem>
                  <SelectItem value="desc">Latest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filterStatus === "ALL" ? (
                <p>No appointments yet</p>
              ) : (
                <div className="p-6 border rounded-lg bg-white">
                  <p className="font-medium">
                    No {filterStatus.toLowerCase()} appointments
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    There are currently no {filterStatus.toLowerCase()}{" "}
                    appointments to show.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">{apt.doctor.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </p>
                      {apt.symptoms && (
                        <p className="text-sm text-gray-500 mt-1">
                          {apt.symptoms}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(apt.status)}>
                      {apt.status}
                    </Badge>
                    {(apt.status === "CONFIRMED" ||
                      apt.status === "RESCHEDULED") &&
                      apt.meetingLink && (
                        <Link href={`/patient/consultation/${apt.id}`}>
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </Link>
                      )}
                    {(apt.status === "PENDING" ||
                      apt.status === "CONFIRMED" ||
                      apt.status === "RESCHEDULED") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(apt.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    <RescheduleDialog
                      appointmentId={apt.id}
                      currentDate={apt.date}
                      currentTime={apt.time}
                      doctorName={apt.doctor.name}
                      onReschedule={(newDate, newTime) =>
                        handleReschedule(apt, newDate, newTime)
                      }
                    />
                    {apt.record && (
                      <Link href="/patient/records">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Record
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

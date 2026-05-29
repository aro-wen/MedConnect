/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Video, FileText, XCircle } from "lucide-react";
import { toast } from "sonner";

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

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) {
        toast.success("Appointment cancelled");
        fetchAppointments();
      }
    } catch {
      toast.error("Failed to cancel");
    }
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
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
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
                    {apt.status === "CONFIRMED" && apt.meetingLink && (
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
                      apt.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(apt.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
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

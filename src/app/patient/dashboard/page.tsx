/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, FileText, Stethoscope } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  symptoms: string | null;
  meetingLink: string | null;
  doctor: { name: string; email: string };
}

export default function PatientDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAppointments = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/appointments?role=PATIENT`, {
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

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED",
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your health and appointments
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/patient/doctors">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Stethoscope className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold">Find Doctors</h3>
              <p className="text-gray-600 text-sm mt-1">
                Browse and book with specialists
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/appointments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Calendar className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold">My Appointments</h3>
              <p className="text-gray-600 text-sm mt-1">
                View and manage your bookings
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/records">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <FileText className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold">Medical Records</h3>
              <p className="text-gray-600 text-sm mt-1">
                Access prescriptions and notes
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming appointments</p>
              <Link href="/patient/doctors">
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                  Book Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
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
                          Symptoms: {apt.symptoms}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(apt.status)}>
                      {apt.status}
                    </Badge>
                    {apt.meetingLink && apt.status === "CONFIRMED" && (
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

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  symptoms: string | null;
  meetingLink: string | null;
  patient: { name: string; email: string };
}

export default function DoctorDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAppointments = React.useCallback(async () => {
    try {
      const res = await fetch("/api/appointments?role=DOCTOR", {
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

  const handleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });
      if (res.ok) {
        toast.success("Appointment confirmed");
        fetchAppointments();
      }
    } catch {
      toast.error("Failed to confirm");
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

  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString(),
  );

  const pendingCount = appointments.filter(
    (a) => a.status === "PENDING",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, Dr. {user?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your practice and patient consultations
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
                <p className="text-sm text-gray-600">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/doctor/appointments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Calendar className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold">Manage Appointments</h3>
              <p className="text-gray-600 text-sm mt-1">
                Review and confirm patient bookings
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/doctor/records">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <FileText className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold">Medical Records</h3>
              <p className="text-gray-600 text-sm mt-1">
                View patient history and prescriptions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Confirmations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : appointments.filter((a) => a.status === "PENDING").length ===
            0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter((a) => a.status === "PENDING")
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{apt.patient.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(apt.date).toLocaleDateString()} at{" "}
                          {apt.time}
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
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => handleConfirm(apt.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
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

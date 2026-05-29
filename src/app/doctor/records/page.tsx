/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Pill, Stethoscope, User } from "lucide-react";

interface MedicalRecord {
  id: string;
  diagnosis: string;
  prescription: string | null;
  notes: string | null;
  createdAt: string;
  doctor: { name: string };
  patient: { name: string };
  appointment: { date: string; time: string };
}

export default function DoctorRecords() {
  const { token } = useAuth();
  const [records, setRecords] = React.useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRecords = React.useCallback(async () => {
    try {
      const res = await fetch("/api/records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch {
      console.error("Failed to fetch records");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600 mt-1">
          View patient consultation history and prescriptions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No medical records yet</p>
              <p className="text-sm">
                Records will appear after completed consultations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="border-l-4 border-l-teal-600">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">
                            {record.patient.name}
                          </span>
                          <Badge variant="secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(
                              record.appointment.date,
                            ).toLocaleDateString()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">
                          Diagnosis
                        </h4>
                        <p className="text-gray-700 mb-4">{record.diagnosis}</p>
                        {record.prescription && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Pill className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-900">
                                Prescription
                              </span>
                            </div>
                            <p className="text-blue-800">
                              {record.prescription}
                            </p>
                          </div>
                        )}
                        {record.notes && (
                          <div className="mt-4">
                            <h5 className="font-medium text-sm text-gray-600 mb-1">
                              Doctor&apos;s Notes
                            </h5>
                            <p className="text-gray-600 text-sm">
                              {record.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Loader2, Clock, CalendarDays } from "lucide-react";
import { toast } from "sonner";

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorSchedule() {
  const { token, user } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const hasFetched = useRef(false);

  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/doctors/schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAvailabilities(data);
      }
    } catch {
      toast.error("Failed to load schedule");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user || !token) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchSchedule();
  }, [user, token, fetchSchedule]);

  const handleAddSlot = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/doctors/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlot),
      });

      if (res.ok) {
        toast.success("Availability added");
        fetchSchedule();
      } else {
        toast.error("Failed to add availability");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (id: string, isAvailable: boolean) => {
    try {
      const res = await fetch(`/api/doctors/schedule/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });

      if (res.ok) {
        setAvailabilities((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, isAvailable: !isAvailable } : a,
          ),
        );
        toast.success("Availability updated");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/doctors/schedule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAvailabilities((prev) => prev.filter((a) => a.id !== id));
        toast.success("Slot removed");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Schedule</h1>
        <p className="text-gray-600 mt-1">
          Set your weekly availability for patient bookings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-teal-600" />
            Add New Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <Label>Day</Label>
              <Select
                value={newSlot.dayOfWeek.toString()}
                onValueChange={(v) =>
                  setNewSlot((prev) => ({ ...prev, dayOfWeek: parseInt(v) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={newSlot.startTime}
                onChange={(e) =>
                  setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={newSlot.endTime}
                onChange={(e) =>
                  setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            onClick={handleAddSlot}
            disabled={isSaving}
            className="mt-4 bg-teal-600 hover:bg-teal-700"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Availability
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availabilities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No availability set yet</p>
              <p className="text-sm">
                Patients won&apos;t be able to book until you add slots
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availabilities.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{DAYS[slot.dayOfWeek]}</p>
                      <p className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    <Badge
                      variant={slot.isAvailable ? "default" : "secondary"}
                      className={
                        slot.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100"
                      }
                    >
                      {slot.isAvailable ? "Available" : "Blocked"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={slot.isAvailable}
                        onCheckedChange={() =>
                          handleToggle(slot.id, slot.isAvailable)
                        }
                      />
                      <span className="text-sm text-gray-600">
                        {slot.isAvailable ? "On" : "Off"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(slot.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
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

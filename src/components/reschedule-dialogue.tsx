"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RescheduleDialogProps {
  appointmentId: string;
  currentDate: string;
  currentTime: string;
  doctorName: string;
  onReschedule: (newDate: string, newTime: string) => void;
}

export function RescheduleDialog({
  appointmentId,
  currentDate,
  currentTime,
  doctorName,
  onReschedule,
}: RescheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(currentDate.split("T")[0]);
  const [time, setTime] = useState(currentTime);
  const [isLoading, setIsLoading] = useState(false);

  const handleReschedule = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, time }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to reschedule");
        return;
      }

      toast.success("Appointment rescheduled successfully!");
      setOpen(false);
      onReschedule(date, time);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-amber-600 border-amber-600 hover:bg-amber-50"
        >
          <CalendarClock className="h-4 w-4 mr-1" />
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule with {doctorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reschedule-date">New Date</Label>
            <Input
              id="reschedule-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reschedule-time">New Time</Label>
            <Input
              id="reschedule-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <Button
            onClick={handleReschedule}
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CalendarClock className="h-4 w-4 mr-2" />
            )}
            Confirm Reschedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

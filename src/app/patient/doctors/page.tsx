/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { Search, Star, Calendar, DollarSign, Stethoscope } from "lucide-react";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  email: string;
  image: string | null;
  doctorProfile: {
    specialization: string;
    bio: string;
    experience: number;
    rating: number;
    consultationFee: number;
  } | null;
}

const specializations = [
  "All",
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Psychiatry",
  "Gastroenterology",
  "General Practice",
];

const symptomToSpecialty: Record<string, string> = {
  heart: "Cardiology",
  "chest pain": "Cardiology",
  headache: "Neurology",
  migraine: "Neurology",
  skin: "Dermatology",
  rash: "Dermatology",
  acne: "Dermatology",
  child: "Pediatrics",
  baby: "Pediatrics",
  bone: "Orthopedics",
  joint: "Orthopedics",
  fracture: "Orthopedics",
  anxiety: "Psychiatry",
  depression: "Psychiatry",
  stress: "Psychiatry",
  stomach: "Gastroenterology",
  digestion: "Gastroenterology",
};

export default function DoctorsPage() {
  const { token } = useAuth();
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [filtered, setFiltered] = React.useState<Doctor[]>([]);
  const [search, setSearch] = React.useState("");
  const [specialization, setSpecialization] = React.useState("All");
  const [selectedDoctor, setSelectedDoctor] = React.useState<Doctor | null>(
    null,
  );
  const [bookingDate, setBookingDate] = React.useState("");
  const [bookingTime, setBookingTime] = React.useState("");
  const [symptoms, setSymptoms] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchDoctors = React.useCallback(async () => {
    try {
      const res = await fetch("/api/doctors");
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
        setFiltered(data);
      }
    } catch {
      console.error("Failed to fetch doctors");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterDoctors = React.useCallback(() => {
    let result = doctors;

    if (specialization !== "All") {
      result = result.filter(
        (d) => d.doctorProfile?.specialization === specialization,
      );
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.doctorProfile?.specialization.toLowerCase().includes(s) ||
          d.doctorProfile?.bio?.toLowerCase().includes(s),
      );
    }

    setFiltered(result);
  }, [doctors, search, specialization]);

  React.useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  React.useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);

  const handleSymptomSearch = () => {
    if (!symptoms) return;
    const s = symptoms.toLowerCase();
    for (const [keyword, specialty] of Object.entries(symptomToSpecialty)) {
      if (s.includes(keyword)) {
        setSpecialization(specialty);
        toast.info(
          `AI Recommendation: ${specialty} specialists shown based on your symptoms`,
        );
        return;
      }
    }
    toast.info("No specific specialty matched. Showing all doctors.");
    setSpecialization("All");
  };

  const handleBook = async () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: bookingDate,
          time: bookingTime,
          symptoms,
        }),
      });

      if (res.ok) {
        toast.success("Appointment booked successfully!");
        setSelectedDoctor(null);
        setBookingDate("");
        setBookingTime("");
        setSymptoms("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to book appointment");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let i = 8; i <= 18; i++) {
      slots.push(`${i.toString().padStart(2, "0")}:00`);
      slots.push(`${i.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="text-gray-600 mt-1">
          Browse specialists and book consultations
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                Describe your symptoms (AI Recommendation)
              </Label>
              <div className="flex gap-2 mt-2">
                <Textarea
                  placeholder="e.g. I have chest pain and shortness of breath..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSymptomSearch}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Recommend
                </Button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No doctors found matching your criteria
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.image || undefined} />
                    <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {doctor.doctorProfile?.specialization}
                    </Badge>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{doctor.doctorProfile?.rating}</span>
                      <span className="mx-2">|</span>
                      <span>{doctor.doctorProfile?.experience} years exp.</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        ${doctor.doctorProfile?.consultationFee}/consultation
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                  {doctor.doctorProfile?.bio}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book with {doctor.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Select
                          value={bookingTime}
                          onValueChange={setBookingTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateTimeSlots().map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Symptoms / Reason for visit</Label>
                        <Textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Describe your symptoms..."
                        />
                      </div>
                      <Button
                        onClick={handleBook}
                        className="w-full bg-teal-600 hover:bg-teal-700"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

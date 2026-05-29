"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";

export default function DoctorConsultation() {
  const { id } = useParams();
  const meetingUrl = `https://meet.jit.si/medconnect-${id}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doctor/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Consultation Room</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-teal-600" />
            Video Consultation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src={meetingUrl}
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-full"
              style={{ minHeight: "500px" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Meeting ID: medconnect-{id}
          </p>
          <p className="text-sm text-gray-500">
            Please allow camera and microphone access when prompted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Calendar, Video, Shield, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Stethoscope className="h-16 w-16 text-teal-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MedConnect Telehealth
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with certified doctors from the comfort of your home. Book
            consultations, get prescriptions, and manage your health — all in
            one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <Calendar className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Schedule appointments with top doctors in just a few clicks.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Video className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Video Consultations
              </h3>
              <p className="text-gray-600">
                Connect face-to-face with doctors through secure video calls.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Shield className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data is encrypted and protected at all times.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-teal-600 text-white">
            <CardContent className="pt-6">
              <Heart className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">For Patients</h3>
              <p className="mb-4">
                Find the right doctor, book appointments, and manage your health
                records.
              </p>
              <Link href="/register?role=PATIENT">
                <Button variant="secondary" size="sm">
                  Register as Patient
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 text-white">
            <CardContent className="pt-6">
              <Stethoscope className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-semibold mb-2">For Doctors</h3>
              <p className="mb-4">
                Manage your practice, schedule, and provide care to patients
                online.
              </p>
              <Link href="/register?role=DOCTOR">
                <Button variant="secondary" size="sm">
                  Register as Doctor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

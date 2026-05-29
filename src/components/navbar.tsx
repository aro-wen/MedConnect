"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Stethoscope,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  FileText,
  Settings,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16" />
      </nav>
    );
  }

  const getDashboardLink = () => {
    if (!user) return "/";
    return user.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";
  };

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === "DOCTOR") {
      return [
        {
          href: "/doctor/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
        { href: "/doctor/records", label: "Records", icon: FileText },
      ];
    }

    return [
      { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/patient/doctors", label: "Find Doctors", icon: Stethoscope },
      { href: "/patient/appointments", label: "Appointments", icon: Calendar },
      { href: "/patient/records", label: "Records", icon: FileText },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href={getDashboardLink()} className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-teal-600" />
              <span className="text-xl font-bold text-teal-600">
                MedConnect
              </span>
            </Link>

            {user && navLinks.length > 0 && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.role === "DOCTOR" ? "Doctor" : "Patient"} Portal
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href={getDashboardLink()}>
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  {user.role === "DOCTOR" ? (
                    <>
                      <Link href="/doctor/appointments">
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Appointments
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/doctor/records">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Medical Records
                        </DropdownMenuItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/patient/doctors">
                        <DropdownMenuItem>
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Find Doctors
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/patient/appointments">
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          My Appointments
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/patient/records">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Medical Records
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

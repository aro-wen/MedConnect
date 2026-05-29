"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    if (!isLoading && user && allowedRole && user.role !== allowedRole) {
      router.push(
        user.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard",
      );
    }
  }, [user, isLoading, router, allowedRole]);

  if (isLoading) {
    return React.createElement(
      "div",
      { className: "flex items-center justify-center min-h-screen" },
      React.createElement("div", {
        className:
          "animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600",
      }),
    );
  }

  if (!user) return null;
  if (allowedRole && user.role !== allowedRole) return null;

  return React.createElement(React.Fragment, null, children);
}

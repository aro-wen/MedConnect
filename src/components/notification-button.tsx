"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, BellOff, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  requestNotificationPermission,
  onNotification,
} from "@/lib/notifications";

interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

function getInitialPermission(): NotificationPermission | "default" {
  if (typeof window === "undefined") return "default";
  if (!("Notification" in window)) return "default";
  return Notification.permission;
}

function getInitialToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

export function NotificationButton() {
  const [permission, setPermission] = useState<
    NotificationPermission | "default"
  >(getInitialPermission);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const token = getInitialToken();
  const hasPolled = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // Silently fail
    }
  }, [token]);

  // Poll every 10 seconds
  useEffect(() => {
    if (!token || hasPolled.current) return;
    hasPolled.current = true;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token, fetchNotifications]);

  // Register callback to receive notifications from anywhere in the app
  useEffect(() => {
    const unsubscribe = onNotification((title, body) => {
      setNotifications((prev) => {
        const newNotif: Notification = {
          id: Date.now().toString(),
          title,
          body,
          read: false,
          createdAt: new Date().toISOString(),
        };
        return [newNotif, ...prev].slice(0, 50);
      });
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    const granted = await requestNotificationPermission();
    setPermission(granted ? "granted" : "denied");
    setIsLoading(false);

    if (granted) {
      toast.success("Notifications enabled!");
    } else {
      toast.error("Please allow notifications in browser settings.");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });
      fetchNotifications();
    } catch {
      // Silently fail
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markAll: true }),
      });
      fetchNotifications();
    } catch {
      // Silently fail
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  if (permission !== "granted") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleEnable}
        disabled={isLoading}
        className="text-teal-600 border-teal-600 hover:bg-teal-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : (
          <Bell className="h-4 w-4 mr-1" />
        )}
        Enable Notifications
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <p className="font-medium text-sm">Notifications</p>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                Read all
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-red-500"
                onClick={clearNotifications}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-gray-500">
            <BellOff className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className={`flex flex-col items-start gap-1 px-3 py-3 cursor-pointer ${
                !notif.read ? "bg-blue-50" : ""
              }`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="flex items-center gap-2 w-full">
                {!notif.read && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full shrink-0" />
                )}
                <p className="font-medium text-sm flex-1">{notif.title}</p>
                <span className="text-xs text-gray-400">
                  {new Date(notif.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 pl-4">{notif.body}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

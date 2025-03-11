// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { cn } from "@allyson/ui/lib/utils";
import { useSignUp, useSignIn, useAuth } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation";
import { Button } from "@allyson/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@allyson/ui/card";
import { Input } from "@allyson/ui/input";
import { Label } from "@allyson/ui/label";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@allyson/ui/input-otp";
import { Dialog, DialogContent } from "@allyson/ui/dialog";
import { DialogTitle } from "@allyson/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useUser } from "@allyson/context";
import { useEffect } from "react";

export function NotificationsDialog({
  className,
  open,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { makeAuthenticatedRequest } = useUser();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Registration successful");
        })
        .catch((error) => {
          console.log("Service worker registration failed");
        });
    }
  }, []);

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration =
          await navigator.serviceWorker.register("/service-worker.js");
        console.log("Service Worker registered:", registration);

        // Request permission for notifications
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          console.log("User subscribed:", subscription);
          // update the user's subscription in the database
          const response = await makeAuthenticatedRequest(
            `${process.env.NEXT_PUBLIC_API_URL}/user/save-web-notification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ web: true, webSubscription: subscription }),
            }
          );
          console.log("Response:", response);
        } else {
          console.log("Notification permission denied.");
          // Notify the user about enabling notifications manually
          toast.error(
            "Notification permission denied. To enable notifications, go to your browser settings, find the 'Notifications' section, and allow notifications for this site."
          );
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <VisuallyHidden.Root>
          <DialogTitle>Enable Notifications</DialogTitle>
        </VisuallyHidden.Root>
        <div className={cn("flex flex-col", className)} {...props}>
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Enable Push Notifications
              </CardTitle>
              <CardDescription>
                Please enable push notifications to allow Allyson to notify when
                she needs your help with a task.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={registerServiceWorker}
              >
                Enable
              </Button>
            
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

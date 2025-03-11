// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@allyson/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@allyson/ui/card";
import PricingComponent from "@allyson/ui/web/settings/pricing";
import { useUser } from "@allyson/context";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import BillingTable from "@allyson/ui/web/settings/billing-table";
import { Switch } from "@allyson/ui/switch";
import { toast } from "sonner";
import {
  IconBell,
  IconBuildingCommunity,
  IconCreditCard,
  IconHistory,
  IconMenu2,
  IconUser,
} from "@tabler/icons-react";
import { ScrollArea, ScrollBar } from "@allyson/ui/scroll-area";
import SidebarMenuComponent from "@allyson/ui/layout/sidebar";
import { useSidebar } from "@allyson/ui/sidebar";

export default function Settings() {
  const { loading, user, makeAuthenticatedRequest } = useUser();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("billing");
  const [isMobile, setIsMobile] = useState(undefined);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [webPushNotifications, setWebPushNotifications] = useState(false);

  useEffect(() => {
    if (!loading) {
      setEmailNotifications(user?.notificationSettings?.email);
      setWebPushNotifications(user?.notificationSettings?.web);
    }
  }, [user]);

  async function updateNotificationSettingsBackend(newEmailNotifications) {
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-notifications`,
        {
          method: "POST",
          body: JSON.stringify({
            mobile: user.notificationSettings.mobile,
            email: newEmailNotifications,
          }),
        }
      );
      const data = await response.json();
      toast.success("Notification Settings Updated");
    } catch (error) {
      toast.error("Error Updating Notification Settings. Please Try Again.");
    }
  }

  useEffect(() => {
    const isBrowser = () => typeof window !== "undefined";
    if (isBrowser()) {
      // Handler to call on window resize
      const handleResize = () => {
        // Set state based on viewport width
        setIsMobile(window.innerWidth < 768);
      };

      // Call the handler right away so state gets updated with initial window size
      handleResize();

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount and unmount

  const registerServiceWorker = async (webPushNotifications) => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration =
          await navigator.serviceWorker.register("/service-worker.js");

        // Request permission for notifications
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          // update the user's subscription in the database
          const response = await makeAuthenticatedRequest(
            `${process.env.NEXT_PUBLIC_API_URL}/user/save-web-notification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                web: webPushNotifications,
                webSubscription: subscription,
              }),
            }
          );
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

  async function disableWebPushNotifications() {
    try {
      await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/user/save-web-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ web: false, webSubscription: {} }),
        }
      );
      toast.success("Web Push Notifications Disabled");
    } catch (error) {
      toast.error("Error Disabling Web Push Notifications. Please Try Again.");
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div className="md:flex">
        <SidebarMenuComponent />
      </div>
      <main className="flex p-4 w-full">
        <div className="w-full flex flex-col">
          <Tabs
            defaultValue="billing"
            className="flex flex-col flex-1"
            onValueChange={setActiveTab}
          >
            <div className="flex md:flex-row flex-col justify-between items-center md:mb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <IconMenu2
                  className="md:hidden text-zinc-200 h-7 w-7"
                  onClick={toggleSidebar}
                />
                <div className="flex flex-row overflow-x-auto hide-scrollbar">
                  <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
                    <TabsTrigger
                      value="billing"
                      className=" relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconCreditCard
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Billing
                    </TabsTrigger>
                    <TabsTrigger
                      value="logs"
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconHistory
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Logs
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconBell
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Notifications
                    </TabsTrigger>
                    {/* <TabsTrigger
                      value="organization"
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconBuildingCommunity
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Organization
                    </TabsTrigger> */}
                  </TabsList>
                </div>
              </div>
            </div>

            <TabsContent value="billing" className="">
              <PricingComponent />
            </TabsContent>
            <TabsContent value="logs" className="">
              <div className="w-full h-full flex items-center justify-center md:mt-0 mt-2">
                <BillingTable user={user} />
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="w-full h-full flex flex-col mt-4">
                <h1 className="text-xl font-bold text-zinc-200">
                  Notifications
                </h1>
                <p className="text-sm text-zinc-400">
                  Manage your notifications
                </p>
                <Card className="w-full my-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-zinc-200">
                          Email Notifications
                        </h1>
                        <p className="text-sm text-zinc-400">
                          Receive updates and alerts via email
                        </p>
                      </div>
                      <Switch
                        size="large"
                        checked={emailNotifications}
                        onCheckedChange={(newValue) => {
                          setEmailNotifications(newValue);
                          updateNotificationSettingsBackend(newValue);
                        }}
                      />
                    </div>
                  </CardHeader>
                </Card>
                <Card className="w-full my-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-zinc-200">
                          Web Push Notifications
                        </h1>
                        <p className="text-sm text-zinc-400">
                          Receive updates and alerts via web push notifications
                        </p>
                      </div>
                      <Switch
                        size="large"
                        checked={webPushNotifications}
                        onCheckedChange={async (newValue) => {
                          setWebPushNotifications(newValue);
                          if (newValue) {
                            await registerServiceWorker(newValue);
                          } else {
                            await disableWebPushNotifications();
                          }
                        }}
                      />
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

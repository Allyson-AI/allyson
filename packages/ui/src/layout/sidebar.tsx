// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@allyson/ui/sidebar";
import {
  IconSettings,
  IconPlus,
  IconBrowser,
  IconCode,
  IconLogin,
  IconFile,
  IconBook,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark, light } from "@clerk/themes";
import { useUser } from "@allyson/context";
import { Skeleton } from "@allyson/ui/skeleton";
import { Button } from "@allyson/ui/button";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { LoginDialog } from "@allyson/ui/web/login-dialog";
import { useSidebar } from "@allyson/ui/sidebar";

export default function SidebarMenuComponent() {
  const { theme } = useTheme();
  const { user, isLoading } = useUser();
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  const isLinkActive = (href) => {
    if (!href) return false;
    if (pathname === href) return true;
    // Check if current path is a sub-page
    return pathname.startsWith(`${href}/`);
  };

  const links = [
    {
      label: "New Session",
      href: "/",
      icon: (
        <Button variant="outline" size="icon" className="h-9 w-9">
          <IconPlus className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      ),
      desktopOnly: true,
      //id: "step-2"
    },
    {
      label: "Sessions",
      href: "/sessions",
      icon: (
        <IconBrowser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      id: "step-3",
    },
    {
      label: "Documents",
      href: "/documents",
      icon: (
        <IconFile className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      id: "step-4",
    },
    {
      label: "API",
      href: "/api-console?tab=tab-1",
      icon: (
        <IconCode className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      id: "step-5",
    },

    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Documentation",
      href: "https://docs.allyson.ai",
      icon: (
        <IconBook className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="flex flex-col h-full">
        <div className="flex-1">
          <div className="hidden md:block md:mb-6">
            <LogoIcon />
          </div>
          {user && (
            <div className="flex flex-col gap-2">
              {/* New Chat button for mobile */}
              <div className="md:hidden mb-2">
                <Button
                  onClick={() => {
                    setOpen(false);
                    router.push("/");
                  }}
                  variant="outline"
                  className="w-full justify-center"
                >
                  <IconPlus className="h-[1.2rem] w-[1.2rem] mr-2" />
                  New Session
                </Button>
              </div>

              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  isActive={isLinkActive(link.href)}
                  desktopOnly={link.desktopOnly}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-start md:justify-center">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ) : user ? (
            <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/" />
          ) : (
            <Button
              onClick={() => {
                setOpen(false);
                setLoginOpen(true);
              }}
              variant="ghost"
              className="relative z-50 w-full flex items-center justify-start space-x-2"
            >
              <IconLogin className="h-[1.2rem] w-[1.2rem]" />
              <p className="block md:hidden text-zinc-200 text-md">Sign In</p>
            </Button>
          )}
        </div>
        {/* Updated bottom section */}
        <div className="block md:hidden mt-auto w-full absolute bottom-0 left-0 right-0 p-4 bg-background">
          {!user && (
            <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
              <div className="flex items-center gap-2">
                <div className="flex grow items-center gap-12">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Download Allyson</p>
                    <p className="text-xs text-muted-foreground">
                      Stay up to date when Allyson needs your help.
                    </p>
                  </div>
                  <a
                    href="https://apps.apple.com/us/app/allyson-ai-email-chatbot/id6593659141"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/app-store.png"
                      width={100}
                      height={60}
                      alt="App Store"
                    />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ fontFamily: "'ClashDisplay', sans-serif" }}
      >
        <Image
          src="/allyson-full-logo.png"
          width={130}
          height={40}
          alt="Allyson"
        />
      </motion.div>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal mt-1 flex space-x-2 items-center text-sm text-black relative z-20"
    >
      <Image
        src="/allyson-app-logo.png"
        width={40}
        height={40}
        alt="Allyson"
        className="rounded-md"
      />
    </Link>
  );
};

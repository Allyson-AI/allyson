// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { cn } from "@allyson/ui/lib/utils";
import Link from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { LogoIcon } from "@allyson/ui/layout/sidebar";
import { usePathname } from "next/navigation";
import {
  MenuTooltipContent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@allyson/ui/tooltip";
import { Logo } from "@allyson/ui/layout/sidebar"; // Make sure this import is correct
import { Button } from "@allyson/ui/button";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return {
    ...context,
    toggleSidebar: () => context.setOpen(!context.open),
  };
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const SidebarComponent = ({ children, open, setOpen }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar {...props} />
      </div>
      <div className="md:hidden">
        <MobileSidebar {...props} />
      </div>
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "h-full w-[60px] px-2 py-2 border flex flex-col items-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "h-12 px-4 flex flex-row md:hidden items-center justify-between bg-background w-full",
          pathname === "/" && "hidden",
          pathname === "/sessions/session" && "hidden",
          pathname === "/sessions" && "hidden",
          pathname === "/documents" && "hidden",
          pathname === "/api-console" && "hidden",
          pathname === "/settings" && "hidden"
        )}
        {...props}
      >
        <div className="flex items-center z-20">
          {pathname !== "/" &&
            pathname !== "/sessions/session" &&
            pathname !== "/sessions" &&
            pathname !== "/documents" &&
            pathname !== "/api-console" &&
            pathname !== "/settings" && (
              <IconMenu2
                className="text-zinc-200"
                onClick={() => setOpen(!open)}
              />
            )}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-background p-6 z-[100] flex flex-col justify-between md:hidden",
              className
            )}
          >
            <div className="flex justify-between items-center mb-4">
              <Logo />
              <IconX
                className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export function SidebarLink({ link, isActive, className, desktopOnly }) {
  const { setOpen } = useSidebar();
  if (!link.href && !link.onClick) {
    return (
      <div
        className={cn(
          "flex items-center justify-start md:justify-center w-full h-10 rounded-md",
          className,
          desktopOnly ? "hidden md:block" : "block"
        )}
      >
        {link.icon}
        <span className="ml-3 md:hidden">{link.label}</span>
      </div>
    );
  }

  const content = (
    <div
      id={link.id}
      className={cn(
        "flex items-center justify-start md:justify-center w-full h-10 rounded-md cursor-pointer",
        !link.label.includes("New Session") &&
          (isActive
            ? "bg-zinc-100 dark:bg-zinc-800"
            : "hover:bg-zinc-50 dark:hover:bg-zinc-900"),
        "md:px-0 px-2",
        className,
        desktopOnly ? "hidden md:block" : ""
      )}
    >
      {link.icon}
      <span className="ml-3 md:hidden">{link.label}</span>
    </div>
  );

  if (link.onClick) {
    return (
      <button onClick={link.onClick} className="w-full">
        {content}
      </button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            onClick={() => setOpen(false)}
            href={link.href}
            target={link.label === "Documentation" ? "_blank" : undefined}
            className="w-full"
          >
            {content}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="hidden md:block">
          <p>{link.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const Sidebar = SidebarComponent;

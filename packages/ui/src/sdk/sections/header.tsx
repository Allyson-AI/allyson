// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { Icons } from "@allyson/ui/sdk/icons";
import { MobileDrawer } from "@allyson/ui/sdk/mobile-drawer";
import { buttonVariants } from "@allyson/ui/button";
import { easeInOutCubic } from "@allyson/ui/sdk/lib/animation";
import { siteConfig } from "@allyson/ui/sdk/lib/config";
import { cn } from "@allyson/ui/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { RainbowButton } from "@allyson/ui/magicui/rainbow-button";
export function Header() {
  return (
    <header className="sticky top-0 h-[var(--header-height)] z-50 p-0 bg-background/60 backdrop-blur py-2">
      <div className="flex justify-between items-center container mx-auto p-2">
        <Link
          href="/"
          title="brand-logo"
          className="relative mr-6 flex items-center space-x-2"
        >
          <Image src="/allyson-full-logo.png" alt="Allyson" width={140} height={100} />
        </Link>
      
      </div>
      <hr className="absolute w-full bottom-0" />
    </header>
  );
}

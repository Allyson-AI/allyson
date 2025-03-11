// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { AuroraText } from "@allyson/ui/magicui/aurora-text";
import { Icons } from "@allyson/ui/sdk/icons";
import { Section } from "@allyson/ui/sdk/section";
import { buttonVariants } from "@allyson/ui/button";
import { siteConfig } from "@allyson/ui/download/lib/config";
import { cn } from "@allyson/ui/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { lazy, Suspense, useEffect, useState } from "react";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1];

function HeroPill() {
  return (
    <motion.a
      href="/blog/introducing-dev-ai"
      className="flex w-auto items-center space-x-2 rounded-full bg-primary/20 px-2 py-1 ring-1 ring-accent whitespace-pre"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="w-fit rounded-full bg-accent px-2 py-0.5 text-left text-xs font-medium text-primary sm:text-sm">
        🛠️ New
      </div>
      <p className="text-xs font-medium text-primary sm:text-sm">
        Introducing AI Agent SDK
      </p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </motion.a>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-3xl flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
      <AuroraText>Install Allyson On Chrome</AuroraText>
      </h1>
      <motion.p
        className="text-left mt-2 max-w-xl leading-normal text-muted-foreground sm:text-lg sm:leading-normal text-balance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        {siteConfig.hero.description}
      </motion.p>
    </div>
  );
}

export function ChromeHero() {
  const [showSpline, setShowSpline] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setShowSpline(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  return (
    <Section id="hero">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-x-8 w-full p-6 lg:p-12 border-x overflow-hidden">
        <div className="flex flex-col justify-center items-start min-h-[300px]">
          <HeroTitles />
        </div>

        <div className="relative h-[600px]">
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/chrome-demo.png"
                alt="Chrome Demo"
                fill
                className="object-contain object-top"
                priority
              />
              <div 
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

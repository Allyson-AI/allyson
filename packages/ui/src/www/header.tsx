"use client";
import Image from "next/image";
import { buttonVariants } from "@allyson/ui/button";
import { cn } from "@allyson/ui/lib/utils";

export default function Header() {
  return (
    <>
      <header className="fixed left-0 top-0  z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
        <div className="px-8 flex h-[3.5rem] items-center justify-between my-2">
          <a href="/">
          <Image
              src="/allyson-full-logo.png"
              alt="Allyson AI Logo"
              className="h-full w-auto object-contain"
              height={120}
              width={120}
              priority
            />
          </a>
          <div className="ml-auto flex h-full items-center">
            <a
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "text-sm"
              )}
              href="https://app.allyson.ai"
            >
              Sign In / Sign Up
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

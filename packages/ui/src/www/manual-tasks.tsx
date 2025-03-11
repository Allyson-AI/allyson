"use client";
import { cn } from "@allyson/ui/lib/utils";
import { useEffect, useState, useRef, Fragment, forwardRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@allyson/ui/bento-grid";
import { Card } from "@allyson/ui/card";
import { AudioLines } from "lucide-react";
import { AnimatedBeam } from "@allyson/ui/magicui/animated-beam";
import { IconWorld, IconFiles, IconUsers, IconUser } from "@tabler/icons-react";

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

const Icons = {
  allyson: () => (
    <img src="/allyson-a.svg" alt="Allyson A Logo" className="w-10 h-10" />
  ),
  gmail: () => <img src="/gmail.svg" alt="Gmail Logo" className="w-12 h-12" />,
  web: () => <IconWorld size={28} />,
  googleCalendar: () => (
    <img
      src="/google-calendar.svg"
      alt="Google Calendar Logo"
      className="w-12 h-12"
    />
  ),
  documents: () => <IconFiles size={28} />,
  users: () => <IconUsers size={28} />,
  user: () => <IconUser size={28} />,
};

export default function ManualTasks() {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full">
        <div
          className={cn(
            "relative flex h-full w-full items-center justify-center overflow-hidden p-10",
            "max-w-4xl mx-auto" // Added max-width and center alignment
          )}
          ref={containerRef}
        >
          <div className="flex size-full flex-row items-stretch justify-between gap-10 w-full">
            {" "}
            {/* Changed max-w-lg to w-full */}
            <div className="flex flex-col justify-center gap-2">
              <Circle ref={div1Ref}>
                <Icons.gmail />
              </Circle>
              <Circle ref={div2Ref}>
                <Icons.googleCalendar />
              </Circle>
              <Circle ref={div3Ref}>
                <Icons.web />
              </Circle>
              <Circle ref={div4Ref}>
                <Icons.documents />
              </Circle>
              <Circle ref={div5Ref}>
                <Icons.users />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle ref={div6Ref} className="size-16">
                <Icons.allyson />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle ref={div7Ref}>
                <Icons.user />
              </Circle>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div1Ref}
            toRef={div6Ref}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div6Ref}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div3Ref}
            toRef={div6Ref}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div4Ref}
            toRef={div6Ref}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div5Ref}
            toRef={div6Ref}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div6Ref}
            toRef={div7Ref}
          />
        </div>
      </div>
    </div>
  );
}

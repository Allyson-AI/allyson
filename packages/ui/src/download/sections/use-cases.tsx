// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { Section } from "@allyson/ui/sdk/section";
import OrbitingCircles from "@allyson/ui/magicui/orbiting-circles";
import { cubicBezier, motion } from "framer-motion";
import {
  AlertTriangleIcon,
  BrainCircuitIcon,
  DatabaseIcon,
  GitForkIcon,
  HeadsetIcon,
  InfoIcon,
  MessageSquareIcon,
  SearchIcon,
  UserSearch,
  XCircleIcon,
  CheckIcon,
} from "lucide-react";
import React from "react";
import { IconTerminal } from "@tabler/icons-react";

const containerVariants = {
  initial: {},
  whileHover: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Card1() {
  const variant1 = {
    initial: {
      scale: 0.87,
      transition: {
        delay: 0.05,
        duration: 0.2,
        ease: "linear",
      },
    },
    whileHover: {
      scale: 0.8,
      boxShadow:
        "rgba(245,40,145,0.35) 0px 20px 70px -10px, rgba(36,42,66,0.04) 0px 10px 24px -8px, rgba(36,42,66,0.06) 0px 1px 4px -1px",
      transition: {
        delay: 0.05,
        duration: 0.2,
        ease: "linear",
      },
    },
  };
  const variant2 = {
    initial: {
      y: -27,
      scale: 0.95,
      transition: {
        delay: 0,
        duration: 0.2,
        ease: "linear",
      },
    },
    whileHover: {
      y: -55,
      scale: 0.87,
      boxShadow:
        "rgba(39,127,245,0.15) 0px 20px 70px -10px, rgba(36,42,66,0.04) 0px 10px 24px -8px, rgba(36,42,66,0.06) 0px 1px 4px -1px",
      transition: {
        delay: 0,
        duration: 0.2,
        ease: "linear",
      },
    },
  };
  const variant3 = {
    initial: {
      y: -25,
      opacity: 0,
      scale: 1,
      transition: {
        delay: 0.05,
        duration: 0.2,
        ease: "linear",
      },
    },
    whileHover: {
      y: -45,
      opacity: 1,
      scale: 1,
      boxShadow:
        "rgba(39,245,76,0.15) 10px 20px 70px -20px, rgba(36,42,66,0.04) 0px 10px 24px -8px, rgba(36,42,66,0.06) 0px 1px 4px -1px",
      transition: {
        delay: 0.05,
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="p-0 h-full overflow-hidden border-b lg:border-b-0 lg:border-r">
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex flex-col gap-y-5 items-center justify-between h-full w-full cursor-pointer"
      >
        <div className="flex h-full w-full items-center justify-center rounded-t-xl border-b">
          <div className="relative flex flex-col items-center justify-center gap-y-2 p-10">
            <motion.div
              variants={variant1}
              className="z-[1] flex h-full w-full items-center justify-between gap-x-2 rounded-md border bg-background p-5 px-2.5 "
            >
              <div className="h-8 w-8 rounded-full bg-[#4A849E] flex items-center justify-center">
                <SearchIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="h-2 w-32 rounded-full bg-neutral-800/50 dark:bg-neutral-200/80"></div>
                <div className="h-2 w-48 rounded-full bg-slate-400/50"></div>
                <div className="text-xs text-neutral-500">
                  I need 100 HVAC leads in Austin, TX
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={variant2}
              className="z-[2] flex h-full w-full items-center justify-between gap-x-2 rounded-md border bg-background p-5 px-2.5 "
            >
              <div className="h-8 w-8 rounded-full bg-[#4A9E62] flex items-center justify-center">
                <DatabaseIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="h-2 w-32 rounded-full bg-neutral-800/50 dark:bg-neutral-200/80"></div>
                <div className="h-2 w-48 rounded-full bg-slate-400/50"></div>
                <div className="h-2 w-20 rounded-full bg-slate-400/50"></div>
                <div className="text-xs text-neutral-500">
                  Saving 1 Lead To CSV
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={variant3}
              className="absolute bottom-0 z-[3] m-auto flex h-fit w-fit items-center justify-between gap-x-2 rounded-md border bg-background p-5 px-2.5 "
            >
              <div className="h-8 w-8 rounded-full bg-[#6F517A] flex items-center justify-center">
                <MessageSquareIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="h-2 w-32 rounded-full bg-neutral-800/50 dark:bg-neutral-200/80"></div>
                <div className="h-2 w-48 rounded-full bg-slate-400/50"></div>
                <div className="h-2 w-20 rounded-full bg-slate-400/50"></div>
                <div className="h-2 w-48 rounded-full bg-slate-400/50"></div>
                <div className="text-xs text-neutral-500">
                  Hey, I need help with this task!
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col gap-y-1 px-5 pb-4 items-start w-full">
          <h2 className="font-semibold tracking-tight text-lg">
            Lead Generation
          </h2>
          <p className="text-sm text-muted-foreground">
            Autonomously generate leads for your business in any industry.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const Card2 = () => {
  const taskSets = [
    // Price Monitoring Task
    [
      {
        id: 1,
        type: "init",
        timestamp: "2023-12-15 14:23:45",
        message: "Starting web automation for product price monitoring",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#4A849E] flex items-center justify-center">
            <InfoIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 2,
        type: "action",
        timestamp: "2023-12-15 14:23:47",
        message: "Navigating to e-commerce site and accepting cookies",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#4A9E62] flex items-center justify-center">
            <UserSearch className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 3,
        type: "extract",
        timestamp: "2023-12-15 14:23:50",
        message: "Extracting prices for iPhone 15 Pro across 5 retailers",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#6F517A] flex items-center justify-center">
            <DatabaseIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 4,
        type: "notify",
        timestamp: "2023-12-15 14:23:52",
        message: "Price drop detected! Sending notification to user",
        icon: (
          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
            <MessageSquareIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 5,
        type: "complete",
        timestamp: "2023-12-15 14:23:55",
        message: "Task completed. Next check scheduled in 30 minutes",
        icon: (
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <CheckIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
    ],
    // Lead Generation Task
    [
      {
        id: 1,
        type: "init",
        timestamp: "2023-12-15 14:24:00",
        message: "Initializing LinkedIn lead generation workflow",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#4A849E] flex items-center justify-center">
            <InfoIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 2,
        type: "search",
        timestamp: "2023-12-15 14:24:03",
        message: "Searching for 'Tech Startup CTOs' in San Francisco",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#4A9E62] flex items-center justify-center">
            <SearchIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 3,
        type: "process",
        timestamp: "2023-12-15 14:24:06",
        message: "Found 50 matching profiles, extracting contact details",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#6F517A] flex items-center justify-center">
            <UserSearch className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 4,
        type: "export",
        timestamp: "2023-12-15 14:24:09",
        message: "Exporting leads to CRM and updating spreadsheet",
        icon: (
          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
            <DatabaseIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 5,
        type: "complete",
        timestamp: "2023-12-15 14:24:12",
        message: "Lead generation complete. 42 new contacts added",
        icon: (
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <CheckIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
    ],
    // Content Monitoring Task
    [
      {
        id: 1,
        type: "init",
        timestamp: "2023-12-15 14:25:00",
        message: "Starting content monitoring on news websites",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#4A849E] flex items-center justify-center">
            <InfoIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 2,
        type: "scan",
        timestamp: "2023-12-15 14:25:03",
        message: "Scanning 10 news sites for AI technology updates",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#4A9E62] flex items-center justify-center">
            <SearchIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 3,
        type: "analyze",
        timestamp: "2023-12-15 14:25:06",
        message: "Analyzing sentiment of 15 new articles found",
        icon: (
          <div className="h-8 w-8 rounded-full bg-[#6F517A] flex items-center justify-center">
            <BrainCircuitIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 4,
        type: "alert",
        timestamp: "2023-12-15 14:25:09",
        message: "Breaking news detected! Sending digest to email",
        icon: (
          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
            <MessageSquareIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
      {
        id: 5,
        type: "complete",
        timestamp: "2023-12-15 14:25:12",
        message: "Monitoring complete. Next scan in 15 minutes",
        icon: (
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <CheckIcon className="h-5 w-5 text-white" />
          </div>
        ),
      },
    ],
  ];

  const [currentTaskIndex, setCurrentTaskIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTaskIndex((prev) => (prev + 1) % taskSets.length);
    }, 3000); // Switch tasks every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-0 h-full overflow-hidden border-b lg:border-b-0 lg:border-r">
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex flex-col gap-y-5 items-center justify-between h-full w-full cursor-pointer"
      >
        <div className="border-b items-center justify-center overflow-hidden bg-transparent rounded-t-xl h-4/5 w-full flex">
          <motion.div className="p-5 rounded-t-md cursor-pointer overflow-hidden h-[270px] flex flex-col gap-y-3.5 w-full">
            {taskSets[currentTaskIndex].map((log, index) => (
              <motion.div
                key={log.id}
                className="p-4 bg-transparent backdrop-blur-md shadow-[0px_0px_40px_-25px_rgba(0,0,0,0.25)] border border-border origin-right w-full rounded-md flex items-center"
                custom={index}
                variants={{
                  initial: (index: number) => ({
                    y: 0,
                    scale: index === 4 ? 0.9 : 1,
                    opacity: 1,
                    transition: {
                      delay: 0.05,
                      duration: 0.2,
                      ease: cubicBezier(0.22, 1, 0.36, 1),
                    },
                  }),
                  whileHover: (index: number) => ({
                    y: -85,
                    opacity: index === 4 ? 1 : 0.6,
                    scale: index === 0 ? 0.85 : index === 4 ? 1.1 : 1,
                    transition: {
                      delay: 0.05,
                      duration: 0.2,
                      ease: cubicBezier(0.22, 1, 0.36, 1),
                    },
                  }),
                }}
                transition={{
                  type: "spring",
                  damping: 40,
                  stiffness: 600,
                }}
              >
                <div className="mr-3">{log.icon}</div>
                <div className="flex-grow">
                  <p className="text-foreground text-xs font-medium">
                    [{log.timestamp}] {log.type.toUpperCase()}
                  </p>
                  <p className="text-muted-foreground text-xs">{log.message}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="flex flex-col gap-y-1 px-5 pb-4 items-start w-full">
          <h2 className="font-semibold tracking-tight text-lg">
            Automated Web Tasks
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor prices, generate leads, and track content across any website.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Card3 = () => {
  return (
    <div className="p-0 min-h-[500px] lg:min-h-fit overflow-hidden border-b lg:border-b-0 -z-0">
      <div className="relative flex flex-col gap-y-5 items-center justify-between h-full w-full">
        <div className="border-b items-center justify-center overflow-hidden rounded-t-xl h-4/5 w-full flex">
          <div className="relative flex items-center justify-center h-full w-full">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[radial-gradient(circle,hsl(var(--accent)/0.3)_0%,transparent_100%)]"></div>
            <OrbitingCircles duration={15} delay={0} radius={40} reverse>
              <div className="h-8 w-8 rounded-full bg-[#4A849E] flex items-center justify-center">
                <SearchIcon className="h-5 w-5 text-white" />
              </div>
            </OrbitingCircles>
            <OrbitingCircles duration={15} delay={20} radius={80}>
              <div className="h-8 w-8 rounded-full bg-[#4A9E62] flex items-center justify-center">
                <UserSearch className="h-5 w-5 text-white" />
              </div>
            </OrbitingCircles>
            <OrbitingCircles radius={120} duration={20} delay={20}>
              <div className="h-8 w-8 rounded-full bg-[#6F517A] flex items-center justify-center">
                <BrainCircuitIcon className="h-5 w-5 text-white" />
              </div>
            </OrbitingCircles>
            <OrbitingCircles radius={160} duration={40} delay={20}>
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <DatabaseIcon className="h-5 w-5 text-white" />
              </div>
            </OrbitingCircles>
            <OrbitingCircles radius={200} duration={30}>
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <IconTerminal className="h-5 w-5 text-white" />
              </div>
            </OrbitingCircles>
          </div>
        </div>
        <div className="flex flex-col gap-y-1 px-5 pb-4 items-start w-full">
          <h2 className="font-semibold tracking-tight text-lg">
            No-API Website Automation
          </h2>
          <p className="text-sm text-muted-foreground">
            Automate any website interaction without needing APIs or special access.
          </p>
        </div>
      </div>
    </div>
  );
};

export function UseCases() {
  return (
    <Section id="use-cases" title="Use Cases">
      <div className="grid lg:grid-cols-3 h-full border border-b-0">
        <Card1 />
        <Card2 />
        <Card3 />
      </div>
    </Section>
  );
}

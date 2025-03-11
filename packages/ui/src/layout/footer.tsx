// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { useTheme } from "next-themes";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@allyson/ui/lib/utils";
import { buttonVariants } from "@allyson/ui/button";
import Image from "next/image";

const footerNavs = [
  {
    label: "Product",
    items: [
      {
        href: "#",
        name: "iOS App",
      },
      {
        href: "#",
        name: "Android App",
      },
      {
        href: "https://allysonai.featurebase.app/",
        name: "Feedback",
      },
      {
        href: "mailto:info@allyson.ai",
        name: "Support",
      },
    ],
  },

  {
    label: "Resources",
    items: [
      {
        href: "https://docs.allyson.ai",
        name: "Docs",
      },
      {
        href: "https://help.allyson.ai",
        name: "Help Center",
      },
      {
        href: "https://status.allyson.ai",
        name: "Status",
      },
      {
        href: "https://docs.allyson.ai/agents",
        name: "Available Agents",
      },
      {
        href: "https://docs.allyson.ai/models",
        name: "Our Models",
      },
    ],
  },
  {
    label: "Socials",
    items: [
      {
        href: "https://x.com/allyson_ai",
        name: "X",
      },
      {
        href: "https://www.linkedin.com/company/allyson-ai",
        name: "LinkedIn",
      },
      {
        href: "https://www.tiktok.com/@allyson.ai",
        name: "TikTok",
      },
      {
        href: "https://www.youtube.com/channel/UCCQXZc8hB7uEp0fjaOuYN2g",
        name: "YouTube",
      },
      {
        href: "https://github.com/Allyson-AI",
        name: "GitHub",
      },
      {
        href: "https://huggingface.co/allyson-ai",
        name: "HuggingFace",
      },
    ],
  },
  {
    label: "Legal",
    items: [
      {
        href: "/privacy",
        name: "Privacy Policy",
      },
      {
        href: "/terms",
        name: "Terms of Service",
      },
    ],
  },
];

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        {/* <div className="gap-4 p-4 py-16 sm:pb-16 md:flex md:justify-between">
          <div className="mb-12 flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2">
            {theme === "dark" ? (
              <Image
                src="/allyson-white-full.svg"
                alt="Allyson AI Logo"
                className="h-20 w-28"
                height={400}
                width={400}
                priority
              />
            ) : (
              <Image
                src="/allyson-full-logo.svg"
                alt="Allyson AI Logo"
                className="h-20 w-28"
                height={400}
                width={400}
                priority
              />
            )}
            </a>
            <div className="max-w-sm">
              <div className="z-10 flex w-full flex-col items-start text-left">
                <p className="mt-2">Your New AI Executive Assistant</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm font-semibold uppercase text-neutral-900 dark:text-white">
                  {nav.label}
                </h2>

                <ul className="grid gap-2">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target={item.target || "_blank"}
                        className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug font-medium text-zinc-400 duration-200 hover:text-neutral-700  dark:hover:text-zinc-200"
                      >
                        {item.name}
                        <ChevronRightIcon className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div> */}

        <div className="flex flex-col gap-2 border-t py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-5 sm:mt-0 sm:justify-center">
            <div className="flex items-center gap-x-2">
              <a href="/" target="_blank">
                <img
                  className="cursor-pointer rounded-md h-[2.5rem] w-[8rem]"
                  src="/app-store.png"
                  alt="Download Allyson on the App Store"
                />
              </a>
              <a href="/" target="_blank">
                <img
                  className="cursor-pointer rounded-md  h-[3.5rem] w-[9rem]"
                  src="/play-store.png"
                  alt="Download Allyson on the Play Store"
                />
              </a>
            </div>
          </div>
          <div>
            <span className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400 sm:text-center">
              Copyright © {new Date().getFullYear()}{" "}
              <a href="/" className="cursor-pointer">
                Allyson AI, Inc.{" "}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

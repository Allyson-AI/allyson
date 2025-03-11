"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Card } from "@allyson/ui/card";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { cn } from "@allyson/ui/lib/utils";
import { buttonVariants } from "@allyson/ui/button";
import Link from "next/link";

const footerSocials = [
  {
    href: "#",
    name: "Linkedin",
    icon: <LinkedInLogoIcon className="size-4" />,
  },
  {
    href: "#",
    name: "Twitter",
    icon: <TwitterLogoIcon className="size-4" />,
  },
];

const footerNavs = [
  {
    label: "Product",
    items: [
      {
        href: "https://app.allyson.ai",
        name: "Dashboard",
      },
      {
        href: "https://apps.apple.com/app/allyson/id6593659141",
        name: "iOS App",
      },
      // {
      //   href: "#",
      //   name: "Android App",
      // },
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
        href: "/blog",
        name: "Blog",
        target: "_parent",
      },
      {
        href: "https://docs.allyson.ai",
        name: "Docs",
      },
      {
        href: "https://status.allyson.ai",
        name: "Status",
      },
      {
        href: "/ai-email-writer",
        name: "AI Email Writer",
        target: "_parent",
      },
      {
        href: "/subject-line-generator",
        name: "Subject Line Generator",
        target: "_parent",
      },
      {
        href: "/email-signature-generator",
        name: "Email Signature Generator",
        target: "_parent",
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

export default function Footer({ city, cities }) {
  const { theme } = useTheme();
  function slugToNormalText(slug) {
    if (slug) {
      const words = slug.split("-");
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return capitalizedWords.join(" ");
    }
  }
  const cityName = slugToNormalText(city);

  let stateCities = [];
  let stateName = "";

  // Find the state that contains the city
  for (const state in cities) {
    if (cities[state].includes(cityName)) {
      stateCities = cities[state];
      stateName = state;
      break;
    }
  }
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="gap-4 p-4 py-16 sm:pb-16 md:flex md:justify-between">
          <div className="mb-12 flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/allyson-full-logo.png"
                alt="Allyson AI Logo"
                className="h-full w-auto object-contain"
                height={150}
                width={150}
                priority
              />
            </a>
            <div className="max-w-sm">
              <div className="z-10 flex w-full flex-col items-start text-left">
                <p className="mt-2">Your New AI Executive Assistant</p>
                <a
                  href="https://app.allyson.ai"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: "default",
                    }),
                    "mt-4 w-full rounded-full px-6 text-sm font-semibold tracking-tighter transition-all ease-out hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2 hover:ring-offset-current dark:hover:ring-neutral-50"
                  )}
                >
                  Get Started Today
                  <ChevronRightIcon className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </a>
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
                      {item.name === "ROI Calculator" ? (
                        <RoiCalculatorDrawer />
                      ) : (
                        <a
                          href={item.href}
                          target={item.target || "_blank"}
                          className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug font-medium text-zinc-400 duration-200 hover:text-neutral-700  dark:hover:text-zinc-200"
                        >
                          {item.name}
                          <ChevronRightIcon className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-5 sm:mt-0 sm:justify-center">
            <div className="flex items-center gap-x-2">
              <a
                href="https://apps.apple.com/app/allyson/id6593659141"
                target="_blank"
              >
                <img
                  className="cursor-pointer rounded-md h-[2.75rem] w-[8.25rem]"
                  src="/app-store.png"
                  alt="Download Allyson on the App Store"
                />
              </a>
              {/* <a href="/" target="_blank">
                <img
                  className="cursor-pointer rounded-md  h-[3.5rem] w-[9rem]"
                  src="/play-store.png"
                  alt="Download Allyson on the Play Store"
                />
              </a> */}
            </div>
          </div>
          <div>
            <span className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400 sm:text-center">
              Copyright © {new Date().getFullYear()}{" "}
              <a href="/" className="cursor-pointer">
                Allyson, Inc.{" "}
              </a>
            </span>
            {/* <a
              href="https://www.isaiahbjork.com"
              target="_blank"
              className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400 sm:text-center"
            >
              Built By The 🐐
            </a> */}
          </div>
        </div>
        {city && (
          <div className="flex flex-col justify-between gap-y-10  pb-10 md:flex-row md:items-center">
            <div className="flex flex-wrap justify-center  border-neutral-700/20 py-4 px-8 gap-2 text-xs">
              {stateCities.map((city) => (
                <Link
                  key={city}
                  href={`https://allyson.ai/executive-assistant/${city
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="text-neutral-500 dark:text-neutral-400"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

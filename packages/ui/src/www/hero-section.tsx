"use client";

import { BorderBeam } from "@allyson/ui/magicui/border-beam";
import TextShimmer from "@allyson/ui/magicui/text-shimmer";
import { Button, buttonVariants } from "@allyson/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Input } from "@allyson/ui/input";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "@allyson/ui/lib/utils";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Dialog, DialogContent } from "@allyson/ui/dialog"; // Add this import
import HeroVideoDialog from "@allyson/ui/magicui/hero-video";
import { motion } from "framer-motion";

export default function HeroSection({ city }) {
  const ease = [0.16, 1, 0.3, 1];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const [email, setEmail] = useState(null);
  const [signedUp, setSignedUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const searchParams = useSearchParams();
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

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  function getLeaderboard() {
    fetch(
      "https://api.getwaitlist.com/api/v1/waitlist/12966/leaderboard?total_signups=5",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data);
      });
  }
  function submit(e) {
    const referral = searchParams.get("ref_id");
    console.log(referral);
    e.preventDefault();
    if (email) {
      fetch("https://api.getwaitlist.com/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          waitlist_id: 12966,
          referral_link: `https://allyson.ai/?ref_id=${referral}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.referral_link) {
            toast({
              title: "Success",
              description:
                "You're on the waitlist! Refer friends to move up the leaderboard faster.",
            });

            setSignedUp(true);
            setReferralLink(data.referral_link);
          } else {
            toast({
              title: "Error",
              description: "There may have been an error, please try again.",
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      toast({
        title: "Error",
        description: "Please add an email address.",
      });
    }
  }
  function copy(e) {
    e.preventDefault();
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
  }
  useEffect(() => {
    getLeaderboard();
  }, [signedUp, referralLink]);

  const [videoDialogOpen, setVideoDialogOpen] = useState(false); // Add this state

  return (
    <section
      id="hero"
      className="relative mx-auto mt-24 mb-20 md:mb-40   text-center md:px-8"
    >
      <div className="backdrop-filter-[12px] inline-flex h-7 items-center justify-between rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white dark:text-black transition-all ease-in hover:cursor-pointer hover:bg-white/20 group gap-1 translate-y-[-1rem] animate-fade-in opacity-0">
        <TextShimmer className="inline-flex items-center justify-center">
          {cityName ? (
            <span>✨ Start Automating Your Business in {cityName} Today</span>
          ) : (
            <span>✨ Start Saving 20+ Hours Per Month</span>
          )}

          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </TextShimmer>
      </div>
      <h1
        style={{ fontFamily: "'ClashDisplay', sans-serif" }}
        className="bg-gradient-to-br from-[#e4e4e7] via-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0)] bg-clip-text py-6 text-[2.75rem] font-medium leading-none text-transparent text-balance md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]"
      >
        Meet Allyson <br className="block" />
        <span className="text-[1.5rem] md:text-6xl ">
          AI Web Agent
        </span>
      </h1>
      <p className="mb-12 text-md tracking-tight text-zinc-200 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
        Allyson enhances your productivity by automating repetitive tasks such
        as inbox management, appointment scheduling, & more.
      </p>
      <div className="flex flex-col items-center justify-center gap-2">
        <a
          href="https://app.allyson.ai"
          className={cn(buttonVariants({ variant: "default" }), "")}
        >
          <span>Get Started</span>
          <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </a>
      </div>

      <div
        ref={ref}
        className="relative mt-20 animate-fade-up opacity-0 before:animate-image-glow  [--animation-delay:100ms] [perspective:2000px] rounded-xl w-full before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom_right,var(--color-two),transparent_40%),linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)]"
      >
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/2-4soCJXChY?si=qk4X9SCzEGwTrFVB"
          thumbnailSrc="/dash.png"
          thumbnailAlt="Hero Video"
          className="w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-1/4 bg-gradient-to-t from-background via-background to-transparent"></div>
      </div>
    </section>
  );
}

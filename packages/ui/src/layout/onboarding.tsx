// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { ReactNode, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useUser } from "@allyson/context";

// Dynamically import React Joyride with SSR disabled
const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

interface OnboardingLayoutProps {
  children: ReactNode;
}
import { CallBackProps, TooltipRenderProps } from "react-joyride";
import { Button } from "@allyson/ui/button";

function CustomTooltip(props: TooltipRenderProps) {
  const {
    backProps,
    closeProps,
    continuous,
    index,
    primaryProps,
    skipProps,
    step,
    tooltipProps,
  } = props;

  return (
    <div
      className="border p-4 max-w-md rounded-md relative bg-black"
      {...tooltipProps}
    >
      <div className="">
        {step.title && <h4 className="font-semibold mb-2">{step.title}</h4>}
        <p className="text-sm mb-4 text-zinc-400">{step.content}</p>
      </div>

      {/* Button group in single row */}
      <div className="flex justify-between items-center gap-2">
        {/* Left-aligned skip button */}
        <Button variant="outline" {...skipProps}>
          {skipProps.title}
        </Button>

        {/* Right-aligned navigation buttons */}
        <div className="flex items-center gap-2">
          {/* {index > 0 && (
            <Button variant="outline" {...backProps}>
              {backProps.title}
            </Button>
          )} */}
          {continuous && (
            <Button variant="outline" {...primaryProps}>
              {primaryProps.title}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Define onboarding steps with detailed descriptions
const steps = [
  {
    target: "#step-1",
    title: "Handle Tasks For You",
    content:
      "Allyson can handle tasks online for you can start as many sessions as you want at the same time to maximize productivity. Provide as much information as possible to help her assist you effectively. She will notify you if she needs additional details.",
  },
  {
    target: "#step-2",
    title: "Session Settings",
    content:
      "Here, you can configure all your important variables, including emails, phone numbers, credit card details, and any other necessary information. These details ensure Allyson has access to the right data when needed.",
  },
  {
    target: "#step-3",
    title: "All Sessions",
    content:
      "This section allows you to view and manage all your past and active sessions. You can track interactions, review completed tasks, and manage ongoing workflows.",
  },
  {
    target: "#step-4",
    title: "Documents",
    content:
      "Access all your saved documents here. You can review, edit, and manage files that Allyson has worked on or stored for you.",
  },
  {
    target: "#step-5",
    title: "API Console",
    content:
      "This is where you manage your API keys, check usage statistics, and monitor all your API-related activities. It provides a comprehensive overview of your API sessions and integration status.",
  },
];

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const [run, setRun] = useState(false);
  const router = useRouter();
  const { user, loading, makeAuthenticatedRequest } = useUser();
  // At the end update teh database with isOnboarded
  useEffect(() => {
    if (!loading && user?.isOnboarded === false) {
      setRun(true);
    }
  }, [user]);
  async function updateUser() {
    const response = await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-onboarding`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  // Handle Joyride events and navigation between steps
  const handleJoyrideCallback = useCallback(
    async (data: CallBackProps) => {
      if (data.action === "skip") {
        await updateUser();
        router.push("/");
      }
      if (data.lifecycle === "complete") {
        if (data.index === 1) {
          router.push("/sessions");
        } else if (data.index === 2) {
          router.push("/documents");
        } else if (data.index === 3) {
          router.push("/api-console");
        } else if (data.index === 4) {
          await updateUser();
          router.push("/");
        }
      }
    },
    [router]
  );

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            arrowColor: "#27272a", // set your desired arrow color here
            primaryColor: "#4A849E",
          },
        }}
      />
      {children}
    </>
  );
}

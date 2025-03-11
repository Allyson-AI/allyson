// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@allyson/context";

import PricingComponent from "@allyson/ui/web/billing/pricing";
import HowItWorks from "@allyson/ui/www/how-it-works";
import Section from "@allyson/ui/www/section";

export default function Subscribe() {
  const { user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (user && (user.plan && user.plan !== "free")) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <section className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto hide-scrollbar">
        <div className="mx-auto w-full max-w-6xl mb-[10rem]">
          <div className="flex flex-col p-4">            
            <Section
              title="Pricing"
              subtitle="Choose the plan that's right for you"
              titleClassName="bg-clip-text text-transparent leading-none bg-gradient-to-r from-[#fff] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.3)]"
            >
              <PricingComponent hideBilling={true} />
            </Section>
            <HowItWorks />
          </div>
        </div>
      </div>
    </section>
  );
}

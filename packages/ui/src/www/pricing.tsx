"use client";
import { Button, buttonVariants } from "@allyson/ui/button";
import { cn } from "@allyson/ui/lib/utils";
import { BadgeCheck, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const toHumanPrice = (price, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price / 100);
};

export default function PricingComponent() {
  const [interval, setInterval] = useState("month");
  const [isButtonLoading, setButtonIsLoading] = useState(false);
  const [id, setId] = useState(null);
  const [pricingData, setPricingData] = useState([
    {
      id: "price_1",
      name: "Pro",
      description: "A premium plan for growing businesses",
      features: [
        "500 Credits / Month",
        "Full Access to Allyson",
        "Integrated Inbox",
        "Contact Management",
        "Calendar Management",
        "Advanced Web Search",
        "Advanced Document Analysis",
        "1 GB File Upload Storage",
      ],
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      tasks: 500,
      isMostPopular: true,
    },
    {
      id: "price_2",
      name: "Business",
      description: "A premium plan for growing businesses",
      features: [
        "3,000 Credits / Month",
        "Full Access to Allyson",
        "Integrated Inbox",
        "Contact Management",
        "Calendar Management",
        "Advanced Web Search",
        "Advanced Document Analysis",
        "10 GB File Upload Storage",
      ],
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      tasks: 3000,
      isMostPopular: true,
    },
  ]);

  return (
    <div className="w-full flex flex-col justify-center items-center py-8 max-w-5xl mx-auto overflow-y-auto">
      <div className="w-full max-w-4xl justify-center gap-8 grid grid-cols-1 md:grid-cols-2">
        {pricingData.map((price, idx) => (
          <div
            key={price.id}
            className={cn(
              "relative flex w-full flex-col justify-between gap-4 overflow-hidden rounded-2xl border p-4 text-black dark:text-white",
              {
                "border border-neutral-700 shadow-md shadow-neutral-500 dark:border-neutral-400 dark:shadow-neutral-600":
                  price.isMostPopular,
              }
            )}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <div className="ml-4">
                  <h2 className="text-lg text-zinc-400 font-semibold leading-7">
                    {price.name}
                  </h2>
                  {/* <p className="h-16 text-sm leading-5 text-black/70 dark:text-white">
                      {price.description}
                    </p> */}
                </div>
              </div>
              <div
                className="flex flex-row gap-1 justify-center" // Centering the div
              >
                <span className="text-4xl font-bold bg-clip-text text-transparent leading-none bg-gradient-to-r from-[#fff] to-[rgba(255,255,255,0.3)]">
                  $
                  {interval === "year" ? price.yearlyPrice : price.monthlyPrice}
                  <span className="text-xs"> / {interval}</span>
                </span>
              </div>
              <hr className="m-0 my-2 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />
              {price.features && price.features.length > 0 && (
                <ul className="flex flex-col gap-2 font-normal ">
                  {price.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-xs font-medium text-black dark:text-white"
                    >
                      <BadgeCheck
                        color="#a1a1aa"
                        className="h-5 w-5 shrink-0 rounded-full p-[2px] text-black dark:text-white"
                      />
                      <span className="flex text-lg text-zinc-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <a
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-sm"
              )}
              href="https://app.allyson.ai"
            >
              Subscribe
            </a>
            
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { Button } from "@allyson/ui/button";
import { Switch } from "@allyson/ui/switch";
import { cn } from "@allyson/ui/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { BadgeCheck, Loader } from "lucide-react";
import { Separator } from "@allyson/ui/separator";
import { Slider } from "@allyson/ui/slider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@allyson/context";
import { Card } from "@allyson/ui/card";
import { Minus, Plus } from "lucide-react";
import BillingTable from "@allyson/ui/web/settings/billing-table";
import { Progress } from "@allyson/ui/progress";
import {
  IconArrowDown,
  IconArrowRight,
  IconBolt,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { Input } from "@allyson/ui/input";
import { ScrollArea } from "@allyson/ui/scroll-area";
import { Badge } from "@allyson/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@allyson/ui/dialog";

export default function PricingDialog({ open, onOpenChange }) {
  const { user, makeAuthenticatedRequest } = useUser();
  const router = useRouter();
  const [amount, setAmount] = useState(10);

  async function reload(e) {
    e.preventDefault();
    if (amount < 5) {
      toast.error("Minimum amount is $5.");
      return;
    }

    await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/reload-balance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const isBrowser = () => typeof window !== "undefined";
        if (isBrowser() && data?.session?.url) {
          window.location.href = data.session.url;
        }
      });
  }
  async function reloadCoinbase(e) {
    e.preventDefault();
    if (amount < 5) {
      toast.error("Minimum amount is $5.");
      return;
    }

    await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/reload-balance-helio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const isBrowser = () => typeof window !== "undefined";
        if (isBrowser() && data?.session) {
          window.location.href = data.session;
        }
      });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-4">
        <DialogTitle></DialogTitle>
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => setAmount(amount - 10)}
                disabled={amount <= 5}
              >
                <IconMinus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <input
                  value={amount}
                  type="number"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-7xl bg-transparent font-bold max-w-[200px] text-center tracking-tighter outline-none"
                />

                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Amount To Reload
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => setAmount(amount + 10)}
              >
                <IconPlus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          {amount < 5 && (
            <p className="text-sm text-red-500">Minimum amount is $5</p>
          )}
          <Button onClick={reload} className="w-full mt-4" variant="outline">
            Pay With Card
          </Button>
          {/* <Button onClick={reloadCoinbase} className="w-full mt-4" variant="outline">
            Pay With Crypto
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

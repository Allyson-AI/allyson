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
  IconPlus,
} from "@tabler/icons-react";
import { Input } from "@allyson/ui/input";
import { ScrollArea } from "@allyson/ui/scroll-area";
import { Badge } from "@allyson/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@allyson/ui/table";
import PricingDialog from "@allyson/ui/web/settings/pricing-dialog";

// import {
//   Connection,
//   PublicKey,
//   Transaction,
//   SystemProgram,
//   LAMPORTS_PER_SOL,
// } from "@solana/web3.js";
// import { Keypair } from "@solana/web3.js";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
// import { createMemoInstruction } from "@solana/spl-memo";
// import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// import {
//   TOKEN_PROGRAM_ID,
//   createTransferInstruction,
//   getAssociatedTokenAddress,
//   createAssociatedTokenAccountInstruction,
// } from "@solana/spl-token";

interface Feature {
  name: string;
  description: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
}

interface PricingSectionProps {
  tiers: PricingTier[];
  className?: string;
}

export const toHumanPrice = (price, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price / 100);
};

// Function to send 0.01 SOL using the connected wallet

export default function PricingComponent({ hideBilling }) {
  const [isYearly, setIsYearly] = useState(false);
  const tiers = [
    {
      name: "Pay As You Go",
      price: {
        monthly: 0,
        yearly: 0,
      },
      description: "Pay as you go for your web agent needs.",
      features: [
        {
          name: "Usage Based Pricing",
          description: "Reload your account at any time",
          included: true,
        },
        {
          name: "Mobile App Access",
          description: "Stay updated when Allyson needs your help",
          included: true,
        },
        {
          name: "Unlimited API Access",
          description: "API access for your own applications",
          included: true,
        },
        {
          name: "Unlimited Concurrent Sessions",
          description: "Run unlimited concurrent sessions at a time",
          included: true,
        },
        {
          name: "1 GB Document Storage",
          description: "Save documents Allyson creates for you.",
          included: true,
        },
      ],
    },
    {
      name: "Business",
      price: {
        monthly: 250,
        yearly: 2500,
      },
      description: "Ideal for heavy usage users",
      highlight: true,
      badge: "Most Popular",

      features: [
        {
          name: "$250 Credit Monthly",
          description: "We'll credit your account with $250 every month",
          included: true,
        },
        {
          name: "Mobile App Access",
          description: "Stay updated when Allyson needs your help",
          included: true,
        },
        {
          name: "Unlimited API Access",
          description: "API access for your own applications",
          included: true,
        },

        {
          name: "Unlimited Concurrent Sessions",
          description: "Run unlimited concurrent sessions at a time",
          included: true,
        },
        {
          name: "100 GB Document Storage",
          description: "Save documents Allyson creates for you.",
          included: true,
        },
      ],
    },
  ];
  const buttonStyles = {
    default: cn(
      "h-12 bg-zinc-200 dark:bg-zinc-900",
      "hover:bg-zinc-50 dark:hover:bg-zinc-800",
      "text-zinc-900 dark:text-zinc-100",
      "border border-zinc-200 dark:border-zinc-800",
      "hover:border-zinc-300 dark:hover:border-zinc-700",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium"
    ),
    highlight: cn(
      "h-12 bg-zinc-900 dark:bg-zinc-100",
      "hover:bg-zinc-800 dark:hover:bg-zinc-300",
      "text-white dark:text-zinc-900",
      "shadow-[0_1px_15px_rgba(0,0,0,0.1)]",
      "hover:shadow-[0_1px_20px_rgba(0,0,0,0.15)]",
      "font-semibold text-base"
    ),
  };

  const { user, makeAuthenticatedRequest } = useUser();

  const router = useRouter();
  const [amount, setAmount] = useState(10);

  const [showReloadForm, setShowReloadForm] = useState(false);
  const [showStorageForm, setShowStorageForm] = useState(false);
  const [storageAmount, setStorageAmount] = useState(50);
  const STORAGE_PRICE_PER_GB = 0.1; // $0.10 per GB
  const BASE_PRICE = 0.02;

  const [stepCount, setStepCount] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(BASE_PRICE);

  const calculatePrice = (steps: number): number => {
    const TIER_SIZE = 10;
    const MAX_TIER = 1000;

    // Helper function to calculate a single tier's price
    const calculateTierPrice = (
      tierSteps: number,
      multiplier: number
    ): number => {
      return tierSteps * (BASE_PRICE * multiplier);
    };

    // Calculate which tier we're in and how many steps remain in current tier
    const currentTier = Math.min(Math.ceil(steps / TIER_SIZE), MAX_TIER);
    const stepsInCurrentTier = steps - TIER_SIZE * (currentTier - 1);

    let totalPrice = 0;

    // Add up completed tiers
    for (let tier = 1; tier < currentTier; tier++) {
      totalPrice += calculateTierPrice(TIER_SIZE, tier);
    }

    // Add final tier
    totalPrice += calculateTierPrice(
      Math.min(stepsInCurrentTier, TIER_SIZE),
      currentTier
    );

    return totalPrice;
  };

  useEffect(() => {
    setCalculatedPrice(calculatePrice(stepCount));
  }, [stepCount]);

  const addStorage = async (e) => {
    e.preventDefault();
    if (storageAmount < 5) {
      toast.error("Minimum storage increase is 5GB.");
      return;
    }

    await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/add-storage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storage: storageAmount }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const isBrowser = () => typeof window !== "undefined";
        if (isBrowser() && data?.session?.url) {
          window.location.href = data.session.url;
        }
      });
  };

  async function subscribe(plan) {
    if (user?.subscribed) {
      toast.error("You are already subscribed to a plan.");
      return;
    }
    await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: plan }),
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

  // const { publicKey, sendTransaction } = useWallet();
  // const { visible, setVisible } = useWalletModal();

  // async function sendSolanaTransactionWithWallet() {
  //   if (!publicKey) {
  //     setVisible(true);
  //     return;
  //   }
  //   setVisible(false);
  //   try {
  //     // Hit the backend to get a memo id with the amount and userId
  //     // once transaction is confirmed on the frontend hit the backend to confirm the transaction and credit the user
  //     // fallback checks on the back end once per minute once it got confirmed but not on the frontend

  //     // Connect to the Solana devnet
  //     const connection = new Connection(
  //       "https://api.devnet.solana.com",
  //       "confirmed"
  //     );

  //     // Define the recipient's public key
  //     const recipient = new PublicKey(
  //       "ALLYJy5gtjSfrFGJM5xguCpPeN9YpxaGBBWrS5aJ8AeY"
  //     );
  //     const mintUSDC = new PublicKey(
  //       "ANdip75crdKKyDZJQZ7JCXAnpq8UCxdPogbBPfzbNrnK"
  //     );

  //     // Get sender and recipient token accounts
  //     const senderTokenAccount = await getAssociatedTokenAddress(
  //       mintUSDC,
  //       publicKey
  //     );
  //     const recipientTokenAccount = await getAssociatedTokenAddress(
  //       mintUSDC,
  //       recipient
  //     );

  //     // Check if recipient token account exists
  //     const recipientAccountInfo = await connection.getAccountInfo(
  //       recipientTokenAccount
  //     );
  //     const transaction = new Transaction();

  //     // Create recipient token account if needed
  //     if (!recipientAccountInfo) {
  //       const createATAInstruction = createAssociatedTokenAccountInstruction(
  //         publicKey,
  //         recipientTokenAccount,
  //         recipient,
  //         mintUSDC
  //       );
  //       transaction.add(createATAInstruction);
  //     }

  //     // Add transfer instruction
  //     const transferInstruction = createTransferInstruction(
  //       senderTokenAccount,
  //       recipientTokenAccount,
  //       publicKey,
  //       amount * Math.pow(10, 6)
  //     );
  //     transaction.add(transferInstruction);
  //     transaction.add(createMemoInstruction(`924238374`, [publicKey]));

  //     // Send the transaction using the wallet adapter
  //     const signature = await sendTransaction(transaction, connection);

  //     // Confirm the transaction
  //     await connection.confirmTransaction(signature, "confirmed");

  //     console.log("Transaction successful with signature:", signature);
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //   }
  // }

  return (
    <div className="h-screen  w-full overflow-y-auto hide-scrollbar mt-4">
      <div className="w-full flex flex-col items-center mb-20 md:mb-4">
        {!hideBilling && (
          <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
            <Card className="w-full p-4 justify-center items-center">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-col">
                  <h2 className="text-md md:text-lg font-semibold text-zinc-200">
                    Balance
                  </h2>
                  <p className="text-lg md:text-xl font-semibold text-zinc-500 mt-1">
                    $
                    {user?.balance?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowReloadForm(true)}
                >
                  <IconPlus className="mr-2" /> Reload
                </Button>
              </div>
            </Card>
            <Card className="w-full p-4">
              <div className="flex flex-row justify-between items-center">
                {!showStorageForm ? (
                  <>
                    <div className="flex flex-col">
                      <h2 className="text-md md:text-lg font-semibold text-zinc-200">
                        Document Storage
                      </h2>
                      <div className="flex flex-row justify-between text-center">
                        <p className="text-md md:text-lg mt-1 text-zinc-500 font-semibold">
                          {(
                            user?.documentStorageUsed /
                            (1024 * 1024 * 1024)
                          ).toFixed(2)}{" "}
                          /{" "}
                          {(
                            user?.documentStorageLimit /
                            (1024 * 1024 * 1024)
                          ).toFixed(2)}{" "}
                          GB Used
                        </p>
                      </div>
                    </div>
                    {/* <Button
                      variant="outline"
                      onClick={() => setShowStorageForm(true)}
                    >
                      <IconPlus className="mr-2" /> Add Storage
                    </Button> */}
                  </>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg font-semibold text-zinc-200">
                      Add Storage
                    </h2>
                    <div className="flex flex-row gap-2 w-full">
                      <Input
                        type="number"
                        min="50"
                        value={storageAmount}
                        onChange={(e) =>
                          setStorageAmount(Number(e.target.value))
                        }
                        placeholder="Storage in GB (min. 50GB)"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={addStorage}>
                        Confirm ($
                        {(storageAmount * STORAGE_PRICE_PER_GB).toFixed(2)})
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowStorageForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    {storageAmount < 5 && (
                      <p className="text-sm text-red-500">
                        Minimum storage increase is 5GB
                      </p>
                    )}
                    <p className="text-sm text-zinc-400">
                      Cost: ${STORAGE_PRICE_PER_GB}/GB/month = $
                      {(storageAmount * STORAGE_PRICE_PER_GB).toFixed(2)}/month
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        <div className="w-full">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiers.map((tier) => (
                <Card key={tier.name} className="w-full">
                  <div className="p-8 flex-1">
                    <div className="flex justify-between mb-4">
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                            ${isYearly ? tier.price.yearly : tier.price.monthly}
                          </span>
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            /{isYearly ? "year" : "month"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {tier.description}
                        </p>
                      </div>
                      <h3 className="text-md md:text-xl font-semibold text-zinc-900 dark:text-zinc-200 w-full text-right">
                        {tier.name}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {tier.features.map((feature) => (
                        <div key={feature.name} className="flex gap-4">
                          <div
                            className={cn(
                              "mt-1 p-0.5 rounded-full transition-colors duration-200",
                              feature.included
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-zinc-400 dark:text-zinc-600"
                            )}
                          >
                            <CheckIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {feature.name}
                            </div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-auto">
                    <Button
                      className={cn(
                        "w-full relative transition-all duration-300",
                        tier.highlight
                          ? buttonStyles.highlight
                          : buttonStyles.default
                      )}
                      disabled={tier.name === "Pay As You Go"}
                      onClick={() => {
                        if (tier.name === "Business") {
                          subscribe("business");
                        }
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {tier.highlight ? (
                          <>
                            Get started
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>Current Plan</>
                        )}
                      </span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Card className="w-full p-4 mt-4 mb-4">
          <h2 className="text-lg font-semibold text-zinc-200">
            Session Pricing
          </h2>
          <p className="text-sm text-zinc-500">
            Session pricing is based on the number of steps it takes Allyson to
            complete a task.
          </p>
          <Table className="w-full mt-4">
            <TableHeader className="border-b border-zinc-800">
              <TableRow>
                <TableHead className="text-zinc-200 text-center">
                  Steps
                </TableHead>
                <TableHead className="text-zinc-200 text-center">
                  Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="gap-4">
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  1-10
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 1).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  11-20
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 2).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  21-30
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 3).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  31-40
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 4).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  41-50
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 5).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  51-60
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 6).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  61-70
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 7).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  71-80
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 8).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  81-90
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 9).toFixed(2)} / Step
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-zinc-800">
                <TableCell className="text-zinc-200 text-center">
                  91-100
                </TableCell>
                <TableCell className="text-zinc-200 text-center">
                  ${(BASE_PRICE * 10).toFixed(2)} / Step
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <Card className="w-full p-4 mt-4 mb-20">
          <h2 className="text-lg font-semibold text-zinc-200">
            Pricing Calculator
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Calculate the cost of your Allyson usage.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="">
                <p className="text-sm text-zinc-400 mb-2">Number of Steps</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStepCount(Math.max(1, stepCount - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={stepCount}
                    onChange={(e) =>
                      setStepCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStepCount(stepCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="">
                <p className="text-sm text-zinc-400 text-right">Cost</p>
                <div className="text-2xl text-right font-bold text-zinc-200">
                  {calculatedPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
              </div>
            </div>
            <Progress
              value={stepCount > 100 ? 100 : stepCount}
              max={100}
              className="w-full"
            />
          </div>
        </Card>
      </div>
      <PricingDialog open={showReloadForm} onOpenChange={setShowReloadForm} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { cn } from "@allyson/ui/lib/utils";
import { useSignUp, useSignIn, useAuth } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation";
import { Button } from "@allyson/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@allyson/ui/card";
import { Input } from "@allyson/ui/input";
import { Label } from "@allyson/ui/label";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@allyson/ui/input-otp";
import { Dialog, DialogContent } from "@allyson/ui/dialog";
import { DialogTitle } from "@allyson/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

// Add API client utility
const createAccount = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create account");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.log("Error creating account:", error);
  }
};

export function LoginDialog({
  className,
  open,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { userId, getToken } = useAuth();
  const {
    isLoaded: isSignUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
  const {
    isLoaded: isSignInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // If user is signed in, don't render the form
  if (userId) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignUpLoaded || !signUp || !isSignInLoaded || !signIn) return null;
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      // First try to create a new account
      try {
        const signUpAttempt = await signUp.create({
          emailAddress: email,
        });
        // Prepare email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setVerifying(true);
        toast.success("Verification code sent to your email!");
      } catch (err: any) {
        // If email exists, try to sign in instead
        if (err.errors?.[0]?.code === "form_identifier_exists") {
          const signInAttempt = await signIn.create({
            identifier: email,
          });
          // Get the emailAddressId from the first factor
          const emailAddressId = signInAttempt.supportedFirstFactors.find(
            (factor) => factor.strategy === "email_code"
          )?.emailAddressId;
          if (!emailAddressId) {
            throw new Error("Email verification not supported");
          }
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId,
          });
          setVerifying(true);
          toast.success("Verification code sent to your email!");
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      if (err.errors?.[0]) {
        toast.error(err.errors[0].message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignUpLoaded || !signUp || !isSignInLoaded || !signIn) return null;
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      let result;
      let isNewUser = false;

      // Try sign-up verification first
      try {
        result = await signUp.attemptEmailAddressVerification({
          code,
        });
        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          isNewUser = true;
        }
      } catch (err) {
        // If sign-up verification fails, try sign-in verification
        result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
        }
      }

      if (result.status === "complete") {
        try {
          if (isNewUser) {
            const token = await getToken();
            await createAccount(token);
          }
          toast.success("You are signed in!");
          router.push("/");
        } catch (error: any) {
          toast.error("Account setup incomplete. Please contact support.");
          console.error("Account creation error:", error);
          router.push("/");
        }
      }
    } catch (err: any) {
      if (err.errors?.[0]) {
        toast.error(err.errors[0].message);
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
      console.error("Error:", JSON.stringify(err, null, 2));
    } finally {
      setIsProcessing(false);
    }
  }

  const handleWalletConnect = async () => {
    try {
      await select(PhantomWalletName);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <VisuallyHidden.Root>
          <DialogTitle>Sign in to Allyson</DialogTitle>
        </VisuallyHidden.Root>
        <div className={cn("flex flex-col", className)} {...props}>
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {verifying ? "Check your email" : "Sign in to Allyson"}
              </CardTitle>
              <CardDescription>
                {verifying
                  ? `We've sent a verification code to ${email}`
                  : "Start automating your workflow"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verifying ? (
                <div className="flex justify-center">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(value) => setCode(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={isProcessing}
                      onClick={handleVerification}
                    >
                      {isProcessing ? (
                        <>
                          <span className="mr-2">Verifying</span>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@allyson.ai"
                          disabled={isProcessing}
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                        disabled={isProcessing}
                        onClick={handleSubmit}
                      >
                        {isProcessing ? (
                          <>
                            <span className="mr-2">Sending Code</span>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </>
                        ) : (
                          "Continue with Email"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {!verifying && (
            <div className="mb-4 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

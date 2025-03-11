// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { ReactNode } from "react";
import ThemeProvider from "./theme-provider";
import { PostHogProvider } from "@allyson/ui/layout/posthog-provider";
import { Toaster } from "@allyson/ui/sonner";
import { UserProvider } from "@allyson/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@allyson/ui/sidebar";
import AppWalletProvider from "@allyson/ui/layout/wallet-provider";
import OnboardingLayout from "@allyson/ui/layout/onboarding";

interface ProvidersProps {
  children: ReactNode;
  src: string;
}

export default function Providers({ children, src }: ProvidersProps) {
  const queryClient = new QueryClient();

  // Conditional render based on src
  const ProviderWrapper = ({ children }: { children: ReactNode }) => {
    if (src === "www") {
      return (
        <QueryClientProvider client={queryClient}>
          <PostHogProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </QueryClientProvider>
      );
    }

    return (
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          <PostHogProvider>
            <UserProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <SidebarProvider>
                  <AppWalletProvider>
                    <OnboardingLayout>{children}</OnboardingLayout>
                  </AppWalletProvider>
                </SidebarProvider>
                <Toaster />
              </ThemeProvider>
            </UserProvider>
          </PostHogProvider>
        </QueryClientProvider>
      </ClerkProvider>
    );
  };

  return <ProviderWrapper>{children}</ProviderWrapper>;
}

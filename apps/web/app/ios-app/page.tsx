import { Community } from "@allyson/ui/download/sections/community";
import { CTA } from "@allyson/ui/download/sections/cta";
import { Examples } from "@allyson/ui/download/sections/examples";
import { Features } from "@allyson/ui/download/sections/features";
import { Footer } from "@allyson/ui/download/sections/footer";
import { IosHero } from "@allyson/ui/download/sections/ios-hero";
import { IosLogos } from "@allyson/ui/download/sections/ios-logos";
import { UseCases } from "@allyson/ui/download/sections/use-cases";
import { Statistics } from "@allyson/ui/download/sections/statistics";
import { Header } from "@allyson/ui/sdk/sections/header";

export const metadata = {
  title: "Download Allyson on iOS - AI Web Agent",
  description:
    "Allyson is your 24/7 AI agent that handles any task in the background—research, forms, data collection, file management, and more. Get instant alerts when she needs your input, adjust tasks on the fly, and watch results stack up effortlessly. Pay as you go OpenAI operator alternative.",
  openGraph: {
    title: "Download Allyson on iOS - AI Web Agent",
    siteName: "Allyson",
    description:
      "Allyson is your 24/7 AI agent that handles any task in the background—research, forms, data collection, file management, and more. Get instant alerts when she needs your input, adjust tasks on the fly, and watch results stack up effortlessly. Pay as you go OpenAI operator alternative.",
    url: "https://allyson.ai/ios-app",
    images: ["https://allyson.ai/allyson-og.png"],
  },
  keywords: [
    "ai",
    "openai operator",
    "web agent",
    "web automation",
    "ai assistant",
    "ai agent",
    "ai web agent",
    "ai web automation",
    "ai web assistant",
    "ai web agent",
    "ai web automation",
    "automation",
    "allyson",
    "executive assistant",
    "ai executive assistant",
    "mobile app",
    "ios app",
    "allyson ios",
    "allyson mobile",
    "allyson app",
    "allyson ios app",
  ],
  appleItunes: {
    app: {
      id: "6593659141",
      argument: "allyson://", // Replace with your app's URL scheme if different
    },
  },
};


export default function Home() {
  return (
    <main>
      <Header />
      <IosHero />
      <IosLogos />
      <UseCases />
       <Features />
      {/*<Statistics />
      <CTA /> 
      <Footer /> */}
    </main>
  );
}

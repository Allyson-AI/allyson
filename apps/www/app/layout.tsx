import { Inter } from "next/font/google";
import "@allyson/ui/styles/globals.css";
import { AOSInit } from "./aos.ts";
import Script from "next/script";
import Providers from "@allyson/ui/layout/providers";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";

// const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
//   ssr: false,
// });

export const metadata = {
  title: "Allyson - AI Web Agent",
  description:
    "Allyson is your 24/7 AI agent that handles any task in the background—research, forms, data collection, file management, and more. Get instant alerts when she needs your input, adjust tasks on the fly, and watch results stack up effortlessly.",
  openGraph: {
    title: "Allyson - AI Web Agent",
    siteName: "Allyson",
    description:
      "Allyson is your 24/7 AI agent that handles any task in the background—research, forms, data collection, file management, and more. Get instant alerts when she needs your input, adjust tasks on the fly, and watch results stack up effortlessly.",
    url: "https://allyson.ai",
    images: ["https://allyson.ai/allyson-og.png"],
  },
  keywords: [
    "executive assistant",
    "ai email writer",
    "ai assistant",
    "va assistant",
    "virtual assistant",
    "ai agents",
    "ai email",
    "ai email write",
    "ai email writer",
    "ai intelligent agent",
    "ai personal assistant",
    "ai schedule",
    "ai scheduler",
    "ai virtual assistant",
    "artificial intelligence email writing",
    "artificial intelligence scheduling",
    "best ai assistant",
    "email ai",
    "emails ai",
    "e mail ai",
    "virtual assistants ai",
    "ai calendar app",
    "ai digital assistant",
    "ai for writing emails",
    "google calendar ai",
    "open ai email",
    "openai email",
    "personal executive assistant",
    "gmail ai"
  ],
  appleItunes: {
    app: {
      id: '6593659141',
      argument: 'allyson://' // Replace with your app's URL scheme if different
    }
  },
  robots: {
    index: true,
    googleBot: {
      index: true,
    },
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
 

  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-KVFX3HNPMP" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-KVFX3HNPMP');
        `}
      </Script>

      <AOSInit />
      <body className={`${inter.className}`}>
        <Providers src="www">
          {/* <PostHogPageView /> */}
          
          {children}
          
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}

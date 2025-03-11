import "@allyson/ui/styles/globals.css";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import Providers from "@allyson/ui/layout/providers";
const inter = Inter({ subsets: ["latin"] });
import Script from "next/script";

// const PostHogPageView = dynamic(
//   () => import("../components/layout/PostHogPageView"),
//   {
//     ssr: false,
//   }
// );

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
  ],
  appleItunes: {
    app: {
      id: '6593659141',
      argument: 'allyson://' // Replace with your app's URL scheme if different
    }
  },
};

export default function RootLayout({ 
  children 
}: {
  children: React.ReactNode | any
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5CM595BC4Z" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5CM595BC4Z');
          `}
        </Script>
      </head>
      <body className={GeistSans.className}>
        <Providers src="web">
          {/* <PostHogPageView /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { Section } from "@allyson/ui/sdk/section";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const companies = [
  "Apple"
];


export function ChromeLogos() {
  // Replace the companies array with the new logo names
  const logos = ["chrome-web-store"];
  const [currentSet, setCurrentSet] = useState(logos);
  
  // Store URLs for each logo
  const logoUrls = {
    "chrome-web-store": "https://chromewebstore.google.com/detail/allyson-ai-web-agent-pay/kcngcogbkiblljbjjfnojmgfppddockf"
  };

  return (
    <Section id="logos">
      <div className="border-x border-t">
        <div className="grid grid-cols-1">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="flex group items-center justify-center p-8 border-r border-t last:border-r-0 sm:last:border-r md:[&:nth-child(3n)]:border-r md:[&:nth-child(6n)]:border-r-0 md:[&:nth-child(3)]:border-r [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0 sm:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(-n+6)]:border-t-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSet[idx]}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: Math.random() * 0.5,
                  }}
                >
                  <a 
                    href={logoUrls[currentSet[idx]]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Image
                      width={currentSet[idx] === 'app-store' ? 160 : 180}
                      height={currentSet[idx] === 'app-store' ? 53 : 60}
                      src={`/${currentSet[idx]}.svg`}
                      className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-200 ease-out"
                      alt={currentSet[idx]}
                    />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

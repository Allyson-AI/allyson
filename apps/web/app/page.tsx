import React, { Suspense } from "react";
import BrowserClient from "@allyson/ui/web/browser/browser-client";

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 h-screen overflow-hidden">
          <BrowserClient />
        </div>
      </div>
    </Suspense>
  );
}

import React, { Suspense } from "react";
import ApiKeys from "@allyson/ui/web/api/api-keys";

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 h-screen overflow-hidden">
          <ApiKeys />
        </div>
      </div>
    </Suspense>
  );
}
"use client";

import { H1 } from "@/components/ui/h1";

import { Monthly } from "./monthly";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <H1>分析</H1>
      <div>
        <Monthly />
      </div>
    </div>
  );
}

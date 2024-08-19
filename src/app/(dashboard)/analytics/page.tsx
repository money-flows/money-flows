"use client";

import { H1 } from "@/components/ui/h1";

import { Monthly } from "./monthly";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <H1>分析</H1>
      <Monthly title="残高の推移（年間）" type="remaining" />
      <Monthly title="収入の推移（年間）" type="income" />
      <Monthly title="支出の推移（年間）" type="expense" />
    </div>
  );
}

"use client";

import { H1 } from "@/components/ui/h1";

import { MonthlyBarChart } from "./monthly-bar-chart";
import { MonthlyLineChart } from "./monthly-line-chart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <H1>分析</H1>
      <MonthlyLineChart title="残高の推移（年間）" type="remaining" />
      <MonthlyBarChart title="残高の推移（年間）" type="remaining" />
      <MonthlyLineChart title="収入の推移（年間）" type="income" />
      <MonthlyBarChart title="収入の推移（年間）" type="income" />
      <MonthlyLineChart title="支出の推移（年間）" type="expense" />
      <MonthlyBarChart title="支出の推移（年間）" type="expense" />
    </div>
  );
}

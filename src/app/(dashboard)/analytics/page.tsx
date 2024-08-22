"use client";

import { H1 } from "@/components/ui/h1";

import { ByCategoryBarChart } from "./by-category-bar-chart";
import { DailyBarChart } from "./daily-bar-chart";
import { DailyLineChart } from "./daily-line-chart";
import { MonthlyBarChart } from "./monthly-bar-chart";
import { MonthlyLineChart } from "./monthly-line-chart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <H1>分析</H1>
      <MonthlyLineChart title="残高の推移（年間）" type="remaining" />
      <MonthlyLineChart
        title="残高の推移（年間の累計）"
        type="remaining"
        cumulative
      />
      <MonthlyBarChart title="残高の推移（年間）" type="remaining" />
      <MonthlyBarChart
        title="残高の推移（年間の累計）"
        type="remaining"
        cumulative
      />
      <MonthlyLineChart title="収入の推移（年間）" type="income" />
      <MonthlyLineChart
        title="収入の推移（年間の累計）"
        type="income"
        cumulative
      />
      <MonthlyBarChart title="収入の推移（年間）" type="income" />
      <MonthlyBarChart
        title="収入の推移（年間の累計）"
        type="income"
        cumulative
      />
      <MonthlyLineChart title="支出の推移（年間）" type="expense" />
      <MonthlyLineChart
        title="支出の推移（年間の累計）"
        type="expense"
        cumulative
      />
      <MonthlyBarChart title="支出の推移（年間）" type="expense" />
      <MonthlyBarChart
        title="支出の推移（年間の累計）"
        type="expense"
        cumulative
      />
      <DailyLineChart title="残高の推移（月間）" type="remaining" />
      <DailyLineChart
        title="残高の推移（月間の累計）"
        type="remaining"
        cumulative
      />
      <DailyBarChart title="残高の推移（月間）" type="remaining" />
      <DailyBarChart
        title="残高の推移（月間の累計）"
        type="remaining"
        cumulative
      />
      <DailyLineChart title="収入の推移（月間）" type="income" />
      <DailyLineChart
        title="収入の推移（月間の累計）"
        type="income"
        cumulative
      />
      <DailyBarChart title="収入の推移（月間）" type="income" />
      <DailyBarChart
        title="収入の推移（月間の累計）"
        type="income"
        cumulative
      />
      <DailyLineChart title="支出の推移（月間）" type="expense" />
      <DailyLineChart
        title="支出の推移（月間の累計）"
        type="expense"
        cumulative
      />
      <DailyBarChart title="支出の推移（月間）" type="expense" />
      <DailyBarChart
        title="支出の推移（月間の累計）"
        type="expense"
        cumulative
      />
      <ByCategoryBarChart title="カテゴリ別の収入" type="income" />
      <ByCategoryBarChart title="カテゴリ別の支出" type="expense" />
    </div>
  );
}

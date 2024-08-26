"use client";

import { H1 } from "@/components/ui/h1";

import { ByCategoryBarChart } from "./by-category-bar-chart";
import { DailyLineChart } from "./daily-line-chart";
import { MonthlyIncomeExpenseRemainingChart } from "./monthly-income-expense-remaining-chart";
import { MonthlyLineChart } from "./monthly-line-chart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <H1>分析</H1>
      <MonthlyIncomeExpenseRemainingChart title="収支の推移（年間）" />
      <MonthlyLineChart title="残高の推移（年間）" type="remaining" />
      <MonthlyLineChart title="収入の推移（年間）" type="income" />
      <MonthlyLineChart
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
      <DailyLineChart
        title="収入の推移（月間の累計）"
        type="income"
        cumulative
      />
      <DailyLineChart
        title="支出の推移（月間の累計）"
        type="expense"
        cumulative
      />
      <ByCategoryBarChart title="カテゴリ別の収入" type="income" />
      <ByCategoryBarChart title="カテゴリ別の支出" type="expense" />
    </div>
  );
}

"use client";

import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from "react-icons/fa6";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/date";

import { Chart } from "./chart";
import { DataCard } from "./data-card";
import { TopCategoriesCard } from "./top-categories-card";

interface DataCardGridProps {
  from: Date;
  to: Date;
}

export function DataCardGrid({ from, to }: DataCardGridProps) {
  const dateRangeLabel = formatDateRange({ from, to });

  const { data } = useGetSummary(from, to);

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <DataCard
          title="残高"
          value={data.remainingAmount}
          percentageChange={data.remainingChange}
          icon={FaPiggyBank}
          dateRange={dateRangeLabel}
        />
        <DataCard
          title="収入"
          value={data.incomeAmount}
          percentageChange={data.incomeChange}
          icon={FaArrowTrendUp}
          dateRange={dateRangeLabel}
          variant="success"
        />
        <DataCard
          title="支出"
          value={data.expensesAmount}
          percentageChange={data.expensesChange}
          icon={FaArrowTrendDown}
          dateRange={dateRangeLabel}
          variant="danger"
        />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TopCategoriesCard
          title="収入の内訳"
          categories={data.incomeCategories}
          variant="success"
        />
        <TopCategoriesCard
          title="支出の内訳"
          categories={data.expenseCategories}
          variant="danger"
        />
      </div>
      <Chart data={data.days} />
    </>
  );
}

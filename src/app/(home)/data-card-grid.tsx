"use client";

import { useUser } from "@clerk/nextjs";
import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from "react-icons/fa6";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/date";

import { Chart } from "./chart";
import { ChartLoading } from "./chart-loading";
import { DataCard } from "./data-card";
import { DataCardLoading } from "./data-card-loading";
import { useSummarySearchParams } from "./search-params";
import { TopCategoriesCard } from "./top-categories-card";
import { TopCategoriesCardLoading } from "./top-categories-card-loading";

export function DataCardGrid() {
  const user = useUser();

  const { from, to } = useSummarySearchParams();
  const summaryQuery = useGetSummary(from, to);
  const dateRangeLabel = formatDateRange({ from, to });

  if (!user.isLoaded || summaryQuery.isPending) {
    return (
      <>
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
        </div>
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <TopCategoriesCardLoading />
          <TopCategoriesCardLoading />
        </div>
        <ChartLoading />
      </>
    );
  }

  if (summaryQuery.isError) {
    return <p>Failed to load summary data. Please try again later.</p>;
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <DataCard
          title="残高"
          value={summaryQuery.data.remainingAmount}
          percentageChange={summaryQuery.data.remainingChange}
          icon={FaPiggyBank}
          dateRange={dateRangeLabel}
        />
        <DataCard
          title="収入"
          value={summaryQuery.data.incomeAmount}
          percentageChange={summaryQuery.data.incomeChange}
          icon={FaArrowTrendUp}
          dateRange={dateRangeLabel}
          variant="success"
        />
        <DataCard
          title="支出"
          value={summaryQuery.data.expensesAmount}
          percentageChange={summaryQuery.data.expensesChange}
          icon={FaArrowTrendDown}
          dateRange={dateRangeLabel}
          variant="danger"
        />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TopCategoriesCard
          title="収入の内訳"
          categories={summaryQuery.data.incomeCategories}
          variant="success"
        />
        <TopCategoriesCard
          title="支出の内訳"
          categories={summaryQuery.data.expenseCategories}
          variant="danger"
        />
      </div>
      <Chart data={summaryQuery.data.days} />
    </>
  );
}

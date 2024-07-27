"use client";

import { InferResponseType } from "hono";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

import { formatDateRange } from "@/lib/date";
import { client } from "@/lib/hono";

import { DataCard, DataCardLoading } from "./data-card";
import { DateRange } from "./ui/date-range-picker";

interface DataGridProps {
  data?: InferResponseType<typeof client.api.summary.$get, 200>["data"];
  isLoading: boolean;
  dateRange: DateRange;
}

export function DataGrid({ data, isLoading, dateRange }: DataGridProps) {
  const dateRangeLabel = formatDateRange(dateRange);

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
      <DataCard
        title="残高"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="収入"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRangeLabel}
        variant="success"
      />
      <DataCard
        title="支出"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRangeLabel}
        variant="danger"
      />
    </div>
  );
}

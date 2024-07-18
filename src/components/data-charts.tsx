"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { Chart, ChartLoading } from "./chart";

export function DataCharts() {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return <ChartLoading />;
  }

  return <Chart data={data?.days} />;
}

"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { Chart } from "./chart";

export function DataCharts() {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Chart data={data?.days} />
    </div>
  );
}

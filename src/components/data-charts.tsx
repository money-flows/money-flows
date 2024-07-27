"use client";

import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

import { Chart, ChartLoading } from "./chart";

interface DataChartsProps {
  data?: InferResponseType<typeof client.api.summary.$get, 200>["data"];
  isLoading: boolean;
}

export function DataCharts({ data, isLoading }: DataChartsProps) {
  if (isLoading) {
    return <ChartLoading />;
  }

  return <Chart data={data?.days} />;
}

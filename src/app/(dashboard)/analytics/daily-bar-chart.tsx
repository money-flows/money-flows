"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactionsDaily } from "@/features/transactions/api/use-get-transactions-daily";

interface DailyBarChartProps {
  title: React.ReactNode;
  type: "income" | "expense" | "remaining";
  cumulative?: boolean;
}

export function DailyBarChart({
  title,
  type,
  cumulative = false,
}: DailyBarChartProps) {
  const [months] = useState([
    { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    { year: new Date().getFullYear(), month: new Date().getMonth() },
    { year: new Date().getFullYear(), month: new Date().getMonth() - 1 },
  ]);
  const { data, isPending, isError } = useGetTransactionsDaily({
    types: type === "remaining" ? undefined : [type],
    months,
    monthlyCumulative: cumulative,
  });

  const chartConfig = months.reduce((acc, { year, month }, index) => {
    return {
      ...acc,
      [`${year}-${month}`]: {
        label: `${year}年${month}月`,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    };
  }, {}) satisfies ChartConfig;

  const chartData = useMemo(() => {
    if (isPending || isError) {
      return [];
    }

    const groupByMonthData = data.data.reduce(
      (acc, { year, month, date, totalAmount }) => {
        return {
          ...acc,
          [date]: {
            ...acc[date],
            [`${year}-${month}`]: totalAmount * (type === "expense" ? -1 : 1),
          },
        };
      },
      Object.fromEntries(
        Array.from({ length: 31 }, (_, i) => [i + 1, { date: i + 1 }]),
      ) as Record<number, Record<number, number>>,
    );

    return Object.values(groupByMonthData);
  }, [type, data, isPending, isError]);

  if (isPending) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return <p>エラーが発生しました</p>;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `${value}日`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return `${value.toLocaleString()}円`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, [payload]) => {
                    return `${payload?.payload?.date}日`;
                  }}
                  indicator="dot"
                />
              }
            />
            {months.map(({ year, month }) => (
              <Bar
                key={`${year}-${month}`}
                dataKey={`${year}-${month}`}
                fill={`var(--color-${year}-${month})`}
                radius={4}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

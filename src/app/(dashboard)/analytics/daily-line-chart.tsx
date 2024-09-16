"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

function yAxisTickFormatter(value: number) {
  const formatter = new Intl.NumberFormat("ja-JP", {
    notation: "compact",
  });
  return `${formatter.format(value)}円`;
}

interface DailyLineChartProps {
  title: React.ReactNode;
  type: "income" | "expense" | "remaining";
  cumulative?: boolean;
  categoryIds?: string[];
}

export function DailyLineChart({
  title,
  type,
  cumulative = false,
  categoryIds,
}: DailyLineChartProps) {
  const [months] = useState([
    { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    { year: new Date().getFullYear(), month: new Date().getMonth() },
    { year: new Date().getFullYear(), month: new Date().getMonth() - 1 },
    { year: new Date().getFullYear(), month: new Date().getMonth() - 2 },
    { year: new Date().getFullYear(), month: new Date().getMonth() - 3 },
  ]);
  const { data, isPending, isError } = useGetTransactionsDaily({
    types: type === "remaining" ? undefined : [type],
    months,
    monthlyCumulative: cumulative,
    categoryIds,
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
      <Card className="relative h-full">
        <CardHeader className="absolute">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="mt-[4.5rem] h-[calc(100%-4.5rem)]" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return <p>エラーが発生しました</p>;
  }

  return (
    <Card className="relative h-full">
      <CardHeader className="absolute">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full p-6">
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ top: 72 }}>
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
              tickFormatter={yAxisTickFormatter}
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
              <Line
                key={`${year}-${month}`}
                dataKey={`${year}-${month}`}
                stroke={`var(--color-${year}-${month})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

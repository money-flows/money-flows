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
import { useGetTransactionsMonthly } from "@/features/transactions/api/use-get-transactions-monthly";

function yAxisTickFormatter(value: number) {
  const formatter = new Intl.NumberFormat("ja-JP", {
    notation: "compact",
  });
  return `${formatter.format(value)}円`;
}

interface MonthlyExpenseChartProps {
  title: React.ReactNode;
  cumulative?: boolean;
  categoryIds?: string[];
}

export function MonthlyExpenseChart({
  title,
  cumulative = false,
  categoryIds,
}: MonthlyExpenseChartProps) {
  const [years] = useState([
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ]);
  const { data, isPending, isError } = useGetTransactionsMonthly({
    types: ["expense"],
    years,
    yearlyCumulative: cumulative,
    categoryIds,
  });

  const chartConfig = years.reduce((acc, year, index) => {
    return {
      ...acc,
      [year]: {
        label: `${year}年`,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    };
  }, {}) satisfies ChartConfig;

  const chartData = useMemo(() => {
    if (isPending || isError) {
      return [];
    }

    const groupByMonthData = data.data.reduce(
      (acc, { year, month, totalAmount }) => {
        return {
          ...acc,
          [month]: {
            ...acc[month],
            [year]: totalAmount * -1,
          },
        };
      },
      {
        1: { month: 1 },
        2: { month: 2 },
        3: { month: 3 },
        4: { month: 4 },
        5: { month: 5 },
        6: { month: 6 },
        7: { month: 7 },
        8: { month: 8 },
        9: { month: 9 },
        10: { month: 10 },
        11: { month: 11 },
        12: { month: 12 },
      } as Record<number, Record<number, number>>,
    );

    return Object.values(groupByMonthData);
  }, [data, isPending, isError]);

  if (isPending) {
    return (
      <Card className="relative h-full">
        <CardHeader className="absolute">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-full p-6 pt-[4.5rem]">
          <Skeleton className="h-full" />
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `${value}月`}
              padding={{ left: 4, right: 4 }}
              interval="preserveStart"
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
                    return `${payload?.payload?.month}月`;
                  }}
                  indicator="dot"
                />
              }
            />
            {years.map((year) => (
              <Line
                key={year}
                dataKey={year}
                stroke={`var(--color-${year})`}
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

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
import { useGetTransactionsMonthlyByYear } from "@/features/transactions/api/use-get-transactions-monthly-by-year";

interface MonthlyLineChartProps {
  title: React.ReactNode;
  type: "income" | "expense" | "remaining";
  cumulative?: boolean;
}

export function MonthlyLineChart({
  title,
  type,
  cumulative = false,
}: MonthlyLineChartProps) {
  const [years] = useState([
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ]);
  const { data, isPending, isError } = useGetTransactionsMonthlyByYear({
    types: type === "remaining" ? undefined : [type],
    years,
    cumulative,
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

    const groupByMonthData = data.data
      .flatMap(({ year, months }) =>
        months.map(({ month, totalAmount }) => ({
          year,
          month,
          totalAmount,
        })),
      )
      .reduce(
        (acc, { year, month, totalAmount }) => {
          return {
            ...acc,
            [month]: {
              ...acc[month],
              [year]: totalAmount * (type === "expense" ? -1 : 1),
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
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `${value}月`}
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
                type="monotone"
                stroke={`var(--color-${year})`}
                strokeWidth={2}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

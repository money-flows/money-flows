"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactionsMonthly } from "@/features/transactions/api/use-get-transactions-monthly";

const chartConfig = {
  income: {
    label: "収入",
    color: `hsl(var(--chart-1))`,
  },
  expense: {
    label: "支出",
    color: `hsl(var(--chart-5))`,
  },
  remaining: {
    label: "残高",
    color: `hsl(var(--chart-3))`,
  },
};

function yAxisTickFormatter(value: number) {
  const formatter = new Intl.NumberFormat("ja-JP", {
    notation: "compact",
  });
  return `${formatter.format(value)}円`;
}

interface MonthlyIncomeExpenseRemainingChartProps {
  title: React.ReactNode;
}

export function MonthlyIncomeExpenseRemainingChart({
  title,
}: MonthlyIncomeExpenseRemainingChartProps) {
  const [years] = useState([new Date().getFullYear()]);

  const incomeQuery = useGetTransactionsMonthly({
    types: ["income"],
    years,
  });

  const expenseQuery = useGetTransactionsMonthly({
    types: ["expense"],
    years,
  });

  const remainingQuery = useGetTransactionsMonthly({
    years,
  });

  const isPending =
    incomeQuery.isPending || expenseQuery.isPending || remainingQuery.isPending;
  const isError =
    incomeQuery.isError || expenseQuery.isError || remainingQuery.isError;

  const chartData = useMemo(() => {
    if (isPending || isError) {
      return [];
    }

    const groupByMonthData = incomeQuery.data.data.reduce(
      (acc, { month, totalAmount }) => {
        return {
          ...acc,
          [month]: {
            ...acc[month],
            income: totalAmount,
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

    const groupByMonthData2 = expenseQuery.data.data.reduce(
      (acc, { month, totalAmount }) => {
        return {
          ...acc,
          [month]: {
            ...acc[month],
            expense: totalAmount,
          },
        };
      },
      groupByMonthData,
    );

    const groupByMonthData3 = remainingQuery.data.data.reduce(
      (acc, { month, totalAmount }) => {
        return {
          ...acc,
          [month]: {
            ...acc[month],
            remaining: totalAmount,
          },
        };
      },
      groupByMonthData2,
    );

    return Object.values(groupByMonthData3);
  }, [
    incomeQuery.data,
    expenseQuery.data,
    remainingQuery.data,
    isPending,
    isError,
  ]);

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
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 72 }}
            maxBarSize={48}
            stackOffset="sign"
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
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              stackId="income-and-expense"
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              stackId="income-and-expense"
            />
            <Line
              dataKey="remaining"
              stroke="var(--color-remaining)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 1 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

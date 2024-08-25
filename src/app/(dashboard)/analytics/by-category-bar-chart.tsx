"use client";

import { useMemo } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactionsByCategory } from "@/features/transactions/api/use-get-transactions-by-category";

interface ByCategoryBarChartProps {
  title: React.ReactNode;
  type: "income" | "expense" | "remaining";
}

export function ByCategoryBarChart({ title, type }: ByCategoryBarChartProps) {
  const { data, isPending, isError } = useGetTransactionsByCategory({
    types: type === "remaining" ? undefined : [type],
  });

  const chartData = useMemo(() => {
    if (isPending || isError) {
      return [];
    }

    const chartData = data.data.map(({ categoryId, category, totalAmount }) => {
      return {
        categoryId: categoryId ?? "null",
        category: category ?? "未分類",
        totalAmount: totalAmount * (type === "expense" ? -1 : 1),
        fill: `var(--color-${categoryId ?? "null"})`,
      };
    });

    return chartData;
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

  const chartConfig = data.data.reduce(
    (acc, { categoryId, category }, index) => {
      return {
        ...acc,
        [categoryId ?? "null"]: {
          label: `${category ?? "未分類"}`,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      };
    },
    { totalAmount: { label: "合計金額" } },
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height: chartData.length * 40 }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
              right: 64,
            }}
          >
            <YAxis
              dataKey="categoryId"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis
              dataKey="totalAmount"
              type="number"
              domain={[0, chartData[0].totalAmount]}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalAmount" layout="vertical" radius={5}>
              <LabelList
                dataKey="totalAmount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

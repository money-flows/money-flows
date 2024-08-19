"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetTransactionsMonthly } from "@/features/transactions/api/use-get-transactions-monthly";

export function Monthly() {
  const [years] = useState([
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ]);
  const { data } = useGetTransactionsMonthly({ years });

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
    if (!data) {
      return [];
    }

    const groupByMonthData = data.data.reduce(
      (acc, { year, month, totalAmount }) => {
        return {
          ...acc,
          [month]: {
            ...acc[month],
            [year]: totalAmount,
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
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <CardTitle>残高の推移（年間）</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {years.map((year) => (
                <linearGradient
                  key={year}
                  id={`fill${year}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${year})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${year})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => `${value}月`}
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
              <Area
                key={year}
                dataKey={year}
                type="natural"
                fill={`url(#fill${year})`}
                stroke={`var(--color-${year})`}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

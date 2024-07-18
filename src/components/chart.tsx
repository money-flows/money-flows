import { AreaChart, BarChart, FileSearch } from "lucide-react";
import { useState } from "react";

import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

type ChartType = "area" | "bar";

interface ChartProps {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

export function Chart({ data = [] }: ChartProps) {
  const [chartType, setChartType] = useState<ChartType>("area");

  const onTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">収入と支出の推移</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="グラフ形式を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">面グラフ</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">棒グラフ</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              この期間にはデータがありません
            </p>
          </div>
        ) : (
          <>
            {chartType === "area" && <AreaVariant data={data} />}
            {chartType === "bar" && <BarVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ChartLoading() {
  return (
    <Card>
      <CardHeader className="flex justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  );
}

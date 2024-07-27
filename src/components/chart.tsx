import { FileSearch } from "lucide-react";

import { BarVariant } from "./bar-variant";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface ChartProps {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

export function Chart({ data = [] }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1 text-xl">収入と支出の推移</CardTitle>
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
          <BarVariant data={data} />
        )}
      </CardContent>
    </Card>
  );
}

export function ChartLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  );
}

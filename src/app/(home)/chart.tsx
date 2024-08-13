import { FileSearch } from "lucide-react";

import { BarVariant } from "@/components/bar-variant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

export function Chart({ data }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>収入と支出の推移</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-y-4 pb-8">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              この期間にはデータがありません
            </p>
          </div>
        ) : (
          <BarVariant data={data} height={384} />
        )}
      </CardContent>
    </Card>
  );
}

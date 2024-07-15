import { format } from "date-fns";

import { formatCurrency } from "@/lib/amount";

import { Separator } from "./ui/separator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomTooltip({ active, payload }: any) {
  if (!active) return null;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[1].value;

  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div className="bg-muted px-3 py-2 text-sm font-medium tabular-nums tracking-tighter text-muted-foreground">
        {format(date, "yyyy/MM/dd")}
      </div>
      <Separator />
      <div className="space-y-1 px-3 py-2">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-blue-500" />
            <p className="text-sm text-muted-foreground">収入</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-sm text-muted-foreground">支出</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  );
}

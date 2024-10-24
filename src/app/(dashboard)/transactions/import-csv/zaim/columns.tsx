import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/amount";
import { getWeekday } from "@/lib/date";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<{
  date: string;
  description: string;
  amount: number;
  category: string | null;
  tags: string[];
  memo: string | null;
}>[] = [
  {
    accessorKey: "date",
    header: "日付",
    cell: ({ row }) => (
      <span className="tabular-nums tracking-tighter">
        {`${format(row.original.date, "yyyy/MM/dd")} (${getWeekday(row.original.date, "short")})`}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "内容",
    minSize: 96,
  },
  {
    accessorKey: "amount",
    header: "金額",
    cell: ({ row }) => (
      <div
        className={cn(
          "tabular-nums tracking-tighter text-right",
          row.original.amount > 0 ? "text-emerald-600" : "text-rose-600",
        )}
      >
        {formatCurrency(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "カテゴリー",
    cell: ({ row }) =>
      row.original.category ? (
        <Badge variant="outline">{row.original.category}</Badge>
      ) : null,
  },
  {
    accessorKey: "tags",
    header: "タグ",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.tags.map((tag, index) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "memo",
    header: "メモ",
    minSize: 96,
  },
];

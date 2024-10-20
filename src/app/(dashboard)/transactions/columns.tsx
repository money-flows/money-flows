import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferResponseType } from "hono";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/amount";
import { getWeekday } from "@/lib/date";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";

import { Actions } from "./actions";

type Transaction = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
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
  },
  {
    accessorKey: "tags",
    header: "タグ",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag.id} variant="outline">
            {tag.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "account",
    header: "口座",
    minSize: 96,
  },
  {
    accessorKey: "memo",
    header: "メモ",
    minSize: 96,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
    size: 64,
  },
];

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferResponseType } from "hono";

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
    accessorKey: "amount",
    header: "金額",
    cell: ({ row }) => (
      <span className={cn("tabular-nums tracking-tighter")}>
        {formatCurrency(Math.abs(row.original.amount))}
      </span>
    ),
  },
  {
    id: "type",
    header: "種別",
    cell: ({ row }) => {
      const isIncome = row.original.amount > 0;
      if (isIncome) {
        return (
          <span className="line-clamp-1 inline whitespace-nowrap rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
            収入
          </span>
        );
      }
      return (
        <span className="line-clamp-1 inline whitespace-nowrap rounded-md bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">
          支出
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "カテゴリー",
    filterFn: "fuzzy",
  },
  {
    accessorKey: "counterparty",
    header: "取引先",
    minSize: 96,
    filterFn: "fuzzy",
  },
  {
    accessorKey: "account",
    header: "口座",
    minSize: 96,
    filterFn: "fuzzy",
  },
  {
    accessorKey: "memo",
    header: "メモ",
    minSize: 96,
    filterFn: "fuzzy",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
    size: 64,
  },
];

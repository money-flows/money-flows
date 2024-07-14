"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferResponseType } from "hono";

import { formatCurrency } from "@/lib/amount";
import { getWeekday } from "@/lib/date";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";

type Transaction = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "取引日",
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
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "payee",
    header: "取引先",
  },
  {
    accessorKey: "account",
    header: "口座",
  },
];

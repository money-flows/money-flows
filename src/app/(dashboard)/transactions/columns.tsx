"use client";

import { format } from "@formkit/tempo";
import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type Transaction = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"][0];

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "amount",
    header: "金額",
    cell: ({ row }) => (
      <span className="tabular-nums tracking-tighter">
        {`¥${row.original.amount.toLocaleString()}`}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "取引日",
    cell: ({ row }) => (
      <span className="tabular-nums tracking-tighter">
        {format(row.original.date, "YYYY/MM/DD")}
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

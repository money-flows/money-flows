"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

import { Actions } from "./actions";

type Category = InferResponseType<
  typeof client.api.categories.$get,
  200
>["data"][0];

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "カテゴリー名",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
    size: 64,
  },
];

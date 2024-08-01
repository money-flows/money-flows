"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

import { Actions } from "./actions";

type Account = InferResponseType<
  typeof client.api.accounts.$get,
  200
>["data"][0];

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "口座名",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
    size: 64,
  },
];

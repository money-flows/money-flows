"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type Account = InferResponseType<
  typeof client.api.accounts.$get,
  200
>["data"][0];

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "口座名",
  },
];

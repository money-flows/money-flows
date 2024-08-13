"use client";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

import { columns } from "./columns";

export function AccountTable() {
  const accountsQuery = useGetAccounts();

  if (accountsQuery.isPending) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (accountsQuery.isError) {
    return <p>エラーが発生しました</p>;
  }

  return <DataTable columns={columns} data={accountsQuery.data} />;
}

"use client";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

import { columns } from "./columns";

export default function AccountsPage() {
  const { onOpen } = useNewAccount();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data ?? [];

  if (accountsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-full lg:w-[7.5rem]" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <H1>口座</H1>
        <Button size="sm" onClick={onOpen}>
          <Plus className="mr-2 size-4" />
          口座を追加
        </Button>
      </div>
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}

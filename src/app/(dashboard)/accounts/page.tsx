"use client";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-full lg:w-[7.5rem]" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="line-clamp-1 text-xl">口座一覧</CardTitle>
            <Button size="sm" onClick={onOpen}>
              <Plus className="mr-2 size-4" />
              口座を追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={accounts} />
        </CardContent>
      </Card>
    </div>
  );
}

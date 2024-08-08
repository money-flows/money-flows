"use client";

import { Suspense } from "react";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccountsSuspense } from "@/features/accounts/api/use-get-accounts";
import { withClientSideAuthGuard } from "@/features/auth/hocs/with-client-side-auth-guard";

import { columns } from "./columns";

function AccountTableLoading() {
  return <Skeleton className="h-48 w-full" />;
}

function AccountTableInner() {
  const { data: accounts } = useGetAccountsSuspense();

  return <DataTable columns={columns} data={accounts} />;
}

export const AccountTable = withClientSideAuthGuard(
  function AccountTable() {
    return (
      <Suspense fallback={<AccountTableLoading />}>
        <AccountTableInner />
      </Suspense>
    );
  },
  <AccountTableLoading />,
);

"use client";

import { Suspense } from "react";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { withClientSideAuthGuard } from "@/features/auth/hocs/with-client-side-auth-guard";
import { useGetCategoriesSuspense } from "@/features/categories/api/use-get-categories";

import { columns } from "./columns";

function CategoryTableLoading() {
  return <Skeleton className="h-48 w-full" />;
}

function CategoryTableInner() {
  const { data: accounts } = useGetCategoriesSuspense();

  return <DataTable columns={columns} data={accounts} />;
}

export const CategoryTable = withClientSideAuthGuard(
  function CategoryTable() {
    return (
      <Suspense fallback={<CategoryTableLoading />}>
        <CategoryTableInner />
      </Suspense>
    );
  },
  <CategoryTableLoading />,
);

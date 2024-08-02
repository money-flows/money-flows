"use client";

import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { range } from "@/lib/array";

import { columns } from "./columns";
import { TransactionDataTable } from "./transaction-data-table";

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") ?? "";
  const page = searchParams.get("page") ?? "1";
  const types = searchParams.get("types") ?? undefined;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const currentPageIndex = Number(page);

  const { onOpen } = useNewTransaction();

  const deleteTransactionsMutation = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions({
    accountId,
    page,
    types,
  });
  const transactions = transactionsQuery.data?.data ?? [];
  const pageCount = transactionsQuery.data?.meta.pageCount ?? 0;
  const totalCount = transactionsQuery.data?.meta.totalCount ?? 0;

  const handleDeleteSelectedRows = (rows: typeof transactions) => {
    deleteTransactionsMutation.mutate({
      ids: rows.map((row) => row.id),
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-full sm:w-[7.5rem]" />
            <Skeleton className="h-9 w-full sm:w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full sm:max-w-sm" />
            <Skeleton className="ml-auto h-10 w-40" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>履歴</H1>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onOpen} className="w-full sm:w-auto">
            <Plus className="mr-2 size-4" />
            取引を追加
          </Button>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/transactions/import-csv">
              <Upload className="mr-2 size-4" />
              CSV取り込み
            </Link>
          </Button>
        </div>
      </div>
      <TransactionDataTable
        columns={columns}
        data={transactions}
        totalCount={totalCount}
        onSelectedRowsDelete={handleDeleteSelectedRows}
      />
      <Pagination className="text-base font-medium">
        <PaginationContent>
          {range(
            Math.min(Math.max(currentPageIndex - 3, 1), pageCount - 6),
            Math.min(Math.max(currentPageIndex - 3, 1), pageCount - 6) + 7,
          )
            .filter((pageIndex) => pageIndex >= 1 && pageIndex <= pageCount)
            .map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  // href={`?page=${pageIndex}`}
                  href={
                    "/transactions?" +
                    createQueryString("page", pageIndex.toString())
                  }
                  isActive={currentPageIndex === pageIndex}
                >
                  {pageIndex}
                </PaginationLink>
              </PaginationItem>
            ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

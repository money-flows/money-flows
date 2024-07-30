"use client";

import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const params = useSearchParams();
  const accountId = params.get("accountId") ?? "";
  const page = params.get("page") ?? "1";
  const currentPageIndex = Number(page);

  const { onOpen } = useNewTransaction();

  const deleteTransactionsMutation = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions({
    accountId,
    page,
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>履歴</CardTitle>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Button size="sm" onClick={onOpen} className="w-full lg:w-auto">
              <Plus className="mr-2 size-4" />
              取引を追加
            </Button>
            <Button asChild size="sm" className="w-full lg:w-auto">
              <Link href="/transactions/import-csv">
                <Upload className="mr-2 size-4" />
                CSV取り込み
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
                    href={`?page=${pageIndex}`}
                    isActive={currentPageIndex === pageIndex}
                  >
                    {pageIndex}
                  </PaginationLink>
                </PaginationItem>
              ))}
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

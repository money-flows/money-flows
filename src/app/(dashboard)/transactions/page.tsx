"use client";

import { Plus, Upload } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { range } from "@/lib/array";

import { columns } from "./columns";
import { toQueryString, useTransactionsSearchParams } from "./search-params";
import { TransactionDataTable } from "./transaction-data-table";

export default function TransactionsPage() {
  const { searchParams } = useTransactionsSearchParams();
  const { page } = searchParams;

  const { onOpen } = useNewTransaction();

  const transactionsQuery = useGetTransactions(searchParams);
  const accountsQuery = useGetAccounts();
  const deleteTransactionsMutation = useBulkDeleteTransactions();

  if (transactionsQuery.isPending || accountsQuery.isPending) {
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

  if (transactionsQuery.isError || accountsQuery.isError) {
    return <p>エラーが発生しました。</p>;
  }

  const transactions = transactionsQuery.data.data;
  const pageCount = transactionsQuery.data.meta.pageCount;
  const totalCount = transactionsQuery.data.meta.totalCount;

  const accountOptions = accountsQuery.data.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const handleDeleteSelectedRows = (rows: typeof transactions) => {
    deleteTransactionsMutation.mutate({
      ids: rows.map((row) => row.id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>履歴</H1>
        <div className="flex items-center gap-2">
          <Button onClick={onOpen} className="w-full sm:w-auto">
            <Plus className="mr-2 size-4" />
            収支を追加
          </Button>
          <Button asChild className="w-full sm:w-auto">
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
        accountOptions={accountOptions}
        onSelectedRowsDelete={handleDeleteSelectedRows}
      />
      <Pagination className="text-base font-medium">
        <PaginationContent>
          {range(
            Math.min(Math.max(page - 3, 1), pageCount - 6),
            Math.min(Math.max(page - 3, 1), pageCount - 6) + 7,
          )
            .filter((pageIndex) => pageIndex >= 1 && pageIndex <= pageCount)
            .map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  href={
                    "/transactions?" +
                    toQueryString({
                      ...searchParams,
                      page: pageIndex,
                    })
                  }
                  isActive={page === pageIndex}
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

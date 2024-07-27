"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { transaction as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { range } from "@/lib/array";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
import { TransactionDataTable } from "./transaction-data-table";
import { UploadButton } from "./upload-button";

const VARIANTS = {
  LIST: "LIST",
  IMPORT: "IMPORT",
} as const;

type Variant = (typeof VARIANTS)[keyof typeof VARIANTS];

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export default function TransactionsPage() {
  const params = useSearchParams();
  const accountId = params.get("accountId") ?? "";
  const page = params.get("page") ?? "1";
  const currentPageIndex = Number(page);

  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<Variant>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const handleUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const handleCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const { onOpen } = useNewTransaction();

  const createTransactionsMutation = useBulkCreateTransactions();
  const deleteTransactionsMutation = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions({
    accountId,
    page,
  });
  const transactions = transactionsQuery.data?.data ?? [];
  const pageCount = transactionsQuery.data?.meta.pageCount ?? 0;
  const totalCount = transactionsQuery.data?.meta.totalCount ?? 0;

  const handleSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("口座を選択してください");
    }

    const data = values.map((value) => ({
      ...value,
      accountId,
      date: format(new Date(value.date), "yyyy-MM-dd"),
    }));

    createTransactionsMutation.mutate(data, {
      onSuccess: () => {
        handleCancelImport();
      },
    });
  };

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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={handleCancelImport}
          onSubmit={handleSubmitImport}
        />
      </>
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
            <UploadButton onUpload={handleUpload} />
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

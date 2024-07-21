"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { transaction as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
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
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data ?? [];

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

  if (transactionsQuery.isLoading) {
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
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="line-clamp-1 text-xl">取引履歴</CardTitle>
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <Button size="sm" onClick={onOpen} className="w-full lg:w-auto">
                <Plus className="mr-2 size-4" />
                取引を追加
              </Button>
              <UploadButton onUpload={handleUpload} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}

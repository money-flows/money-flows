"use client";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { columns } from "./columns";

export default function TransactionsPage() {
  const { onOpen } = useNewTransaction();

  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data ?? [];

  if (transactionsQuery.isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="border-none drop-shadow-sm">
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
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="line-clamp-1 text-xl">取引履歴</CardTitle>
            <Button size="sm" onClick={onOpen}>
              <Plus className="mr-2 size-4" />
              取引を追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}

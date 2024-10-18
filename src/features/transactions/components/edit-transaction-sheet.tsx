import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetTags } from "@/features/tags/api/use-get-tags";

import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { TransactionApiFormValues } from "./schema";
import { TransactionForm } from "./transaction-form";

export function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const accountQuery = useGetAccounts();
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const incomeCategoryQuery = useGetCategories({
    types: ["income"],
  });
  const expenseCategoryQuery = useGetCategories({
    types: ["expense"],
  });

  const incomeTagQuery = useGetTags({
    types: ["income"],
  });
  const expenseTagQuery = useGetTags({
    types: ["expense"],
  });

  const incomeCategoryOptions = (incomeCategoryQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    }),
  );
  const expenseCategoryOptions = (expenseCategoryQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    }),
  );

  const incomeTagOptions = (incomeTagQuery.data ?? []).map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));
  const expenseTagOptions = (expenseTagQuery.data ?? []).map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    accountQuery.isLoading ||
    incomeCategoryQuery.isLoading ||
    expenseCategoryQuery.isLoading;

  const handleSubmit = (values: TransactionApiFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>取引の編集</SheetTitle>
          <SheetDescription>取引の情報を変更します。</SheetDescription>
        </SheetHeader>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {transactionQuery.data && (
          <TransactionForm
            disabled={isPending}
            defaultValues={{
              accountId: transactionQuery.data.accountId,
              categoryId: transactionQuery.data.categoryId ?? "",
              amount: transactionQuery.data.amount.toString(),
              date: new Date(transactionQuery.data.date),
              description: transactionQuery.data.description ?? "",
              counterparty: transactionQuery.data.counterparty ?? "",
              memo: transactionQuery.data.memo ?? "",
              tagIds: transactionQuery.data.tags.map((tag) => tag.id),
            }}
            onSubmit={handleSubmit}
            accountOptions={accountOptions}
            incomeCategoryOptions={incomeCategoryOptions}
            expenseCategoryOptions={expenseCategoryOptions}
            incomeTagOptions={incomeTagOptions}
            expenseTagOptions={expenseTagOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

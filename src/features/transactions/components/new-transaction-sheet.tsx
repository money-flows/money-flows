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

import { useCreateTransaction } from "../api/use-create-transaction";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { TransactionApiFormValues } from "./schema";
import { TransactionForm } from "./transaction-from";

export function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();

  const { mutate, isPending } = useCreateTransaction();

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

  const isLoading =
    accountQuery.isLoading ||
    incomeCategoryQuery.isLoading ||
    expenseCategoryQuery.isLoading;

  const handleSubmit = (values: TransactionApiFormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>取引の追加</SheetTitle>
          <SheetDescription>
            新しい取引を追加します。取引の情報を入力してください。
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={handleSubmit}
            disabled={isPending}
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

import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useDeleteAccount } from "../api/use-delete-account";
import { useEditAccount } from "../api/use-edit-account";
import { useGetAccount } from "../api/use-get-account";
import { useOpenAccount } from "../hooks/use-open-account";
import { AccountForm, AccountFormValues } from "./account-form";

export function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();

  const { data: account, isLoading } = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (values: AccountFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = account ? { name: account.name } : undefined;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>口座の編集</SheetTitle>
          <SheetDescription>口座の情報を変更します。</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <AccountForm
            disabled={isPending}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

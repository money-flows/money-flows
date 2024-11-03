import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateAccount } from "../api/use-create-account";
import { useNewAccount } from "../hooks/use-new-account";
import { AccountForm, AccountFormValues } from "./account-form";

export function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();

  const handleSubmit = (values: AccountFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>口座の追加</SheetTitle>
          <SheetDescription>
            収支を管理するために、新しい口座を追加します。
          </SheetDescription>
        </SheetHeader>
        <AccountForm onSubmit={handleSubmit} disabled={false} />
      </SheetContent>
    </Sheet>
  );
}

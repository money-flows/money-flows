import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteCategory } from "../api/use-delete-category";
import { useEditCategory } from "../api/use-edit-category";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { CategoryForm, CategoryFormValues } from "./category-form";

export function EditCategorySheet() {
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialog, confirm] = useConfirm(
    "本当に削除しますか？",
    "この操作は取り消せません。",
  );

  const { data: category, isLoading } = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (values: CategoryFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = category ? { name: category.name } : undefined;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>カテゴリーの編集</SheetTitle>
            <SheetDescription>カテゴリーの情報を変更します。</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              disabled={isPending}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

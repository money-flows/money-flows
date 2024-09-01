import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useEditCategory } from "../api/use-edit-category";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { CategoryForm, CategoryFormValues } from "./category-form";

export function EditCategorySheet() {
  const { isOpen, onClose, id } = useOpenCategory();

  const { data: category, isLoading, isPending } = useGetCategory(id);
  const editMutation = useEditCategory(id);

  const handleSubmit = (values: CategoryFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = category
    ? { name: category.name, type: category.type }
    : undefined;

  return (
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
            disabled={isPending}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

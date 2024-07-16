import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateCategory } from "../api/use-create-category";
import { useNewCategory } from "../hooks/use-new-category";
import { CategoryForm, CategoryFormValues } from "./category-form";

export function NewCategorySheet() {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const handleSubmit = (values: CategoryFormValues) => {
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
          <SheetTitle>カテゴリーの追加</SheetTitle>
          <SheetDescription>新しいカテゴリーを追加します。</SheetDescription>
        </SheetHeader>
        <CategoryForm onSubmit={handleSubmit} disabled={false} />
      </SheetContent>
    </Sheet>
  );
}

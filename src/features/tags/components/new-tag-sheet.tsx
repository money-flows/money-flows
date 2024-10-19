import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateTag } from "../api/use-create-tag";
import { useNewTag } from "../hooks/use-new-tag";
import { TagForm, TagFormValues } from "./tag-form";

export function NewTagSheet() {
  const { isOpen, onClose } = useNewTag();

  const mutation = useCreateTag();

  const handleSubmit = (values: TagFormValues) => {
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
          <SheetTitle>タグの追加</SheetTitle>
          <SheetDescription>新しいタグを追加します。</SheetDescription>
        </SheetHeader>
        <TagForm onSubmit={handleSubmit} disabled={false} />
      </SheetContent>
    </Sheet>
  );
}

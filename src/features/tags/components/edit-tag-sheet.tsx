import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useEditTag } from "../api/use-edit-tag";
import { useGetTag } from "../api/use-get-tag";
import { useOpenTag } from "../hooks/use-open-tag";
import { TagForm, TagFormValues } from "./tag-form";

export function EditTagSheet() {
  const { isOpen, onClose, id } = useOpenTag();

  const { data: tag, isLoading, isPending } = useGetTag(id);
  const editMutation = useEditTag(id);

  const handleSubmit = (values: TagFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = tag ? { name: tag.name, type: tag.type } : undefined;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>タグの編集</SheetTitle>
          <SheetDescription>タグの情報を変更します。</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TagForm
            disabled={isPending}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

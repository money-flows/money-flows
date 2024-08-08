"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

export function AddCategoryButton() {
  const { onOpen } = useNewCategory();

  return (
    <Button size="sm" onClick={onOpen}>
      <Plus className="mr-2 size-4" />
      カテゴリーを追加
    </Button>
  );
}

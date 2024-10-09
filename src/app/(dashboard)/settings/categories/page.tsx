"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

import { CategoryTable } from "./category-table";

export default function CategoriesPage() {
  const { onOpen } = useNewCategory();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>カテゴリー</H1>
        <Button onClick={onOpen}>
          <Plus className="mr-2 size-4" />
          カテゴリーを追加
        </Button>
      </div>
      <CategoryTable />
    </div>
  );
}

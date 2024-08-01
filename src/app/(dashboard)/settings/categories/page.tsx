"use client";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

import { columns } from "./columns";

export default function CategoriesPage() {
  const { onOpen } = useNewCategory();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data ?? [];

  if (categoriesQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-full lg:w-[7.5rem]" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>カテゴリー</H1>
        <Button size="sm" onClick={onOpen}>
          <Plus className="mr-2 size-4" />
          カテゴリーを追加
        </Button>
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
}

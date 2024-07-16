"use client";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-full lg:w-[7.5rem]" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="line-clamp-1 text-xl">
              カテゴリー一覧
            </CardTitle>
            <Button size="sm" onClick={onOpen}>
              <Plus className="mr-2 size-4" />
              カテゴリーを追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}

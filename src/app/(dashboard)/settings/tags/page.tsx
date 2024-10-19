"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import { useNewTag } from "@/features/tags/hooks/use-new-tag";

import { TagTable } from "./tag-table";

export default function CategoriesPage() {
  const { onOpen } = useNewTag();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>タグ</H1>
        <Button onClick={onOpen}>
          <Plus className="mr-2 size-4" />
          タグを追加
        </Button>
      </div>
      <TagTable />
    </div>
  );
}

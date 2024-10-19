"use client";

import { H1 } from "@/components/ui/h1";

import { TagTable } from "./tag-table";

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>タグ</H1>
      </div>
      <TagTable />
    </div>
  );
}

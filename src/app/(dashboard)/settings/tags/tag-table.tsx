"use client";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTags } from "@/features/tags/api/use-get-tags";

import { columns } from "./columns";

export function TagTable() {
  const tagsQuery = useGetTags({
    types: ["income", "expense"],
  });

  if (tagsQuery.isPending) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (tagsQuery.isError) {
    return <p>エラーが発生しました</p>;
  }

  return <DataTable columns={columns} data={tagsQuery.data} />;
}

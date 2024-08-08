import { H1 } from "@/components/ui/h1";

import { AddCategoryButton } from "./add-category-button";
import { CategoryTable } from "./category-table";

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>カテゴリー</H1>
        <AddCategoryButton />
      </div>
      <CategoryTable />
    </div>
  );
}

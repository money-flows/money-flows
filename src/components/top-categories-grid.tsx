"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import {
  TopCategoriesCard,
  TopCategoriesCardLoading,
} from "./top-categories-card";

export function TopCategoriesGrid() {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
        <TopCategoriesCardLoading />
        <TopCategoriesCardLoading />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
      <TopCategoriesCard
        title="収入のカテゴリー"
        categories={data?.incomeCategories}
        variant="success"
      />
      <TopCategoriesCard
        title="支出のカテゴリー"
        categories={data?.expenseCategories}
        variant="danger"
      />
    </div>
  );
}

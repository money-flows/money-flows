"use client";

import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

import {
  TopCategoriesCard,
  TopCategoriesCardLoading,
} from "./top-categories-card";

interface TopCategoriesGridProps {
  data?: InferResponseType<typeof client.api.summary.$get, 200>["data"];
  isLoading: boolean;
}

export function TopCategoriesGrid({ data, isLoading }: TopCategoriesGridProps) {
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
        title="収入の内訳"
        categories={data?.incomeCategories}
        variant="success"
      />
      <TopCategoriesCard
        title="支出の内訳"
        categories={data?.expenseCategories}
        variant="danger"
      />
    </div>
  );
}

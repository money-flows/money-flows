"use client";

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { TopCategoriesGrid } from "@/components/top-categories-grid";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <DataGrid />
      <TopCategoriesGrid />
      <DataCharts />
    </div>
  );
}

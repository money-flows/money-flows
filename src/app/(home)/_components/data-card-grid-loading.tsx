import { ChartLoading } from "@/components/chart";
import { DataCardLoading } from "@/components/data-card";
import { TopCategoriesCardLoading } from "@/components/top-categories-card";

export function DataCardGridLoading() {
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TopCategoriesCardLoading />
        <TopCategoriesCardLoading />
      </div>
      <ChartLoading />
    </>
  );
}

import { ChartLoading } from "./chart-loading";
import { DataCardLoading } from "./data-card-loading";
import { TopCategoriesCardLoading } from "./top-categories-card-loading";

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

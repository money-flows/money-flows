"use client";

import { differenceInDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { TopCategoriesGrid } from "@/components/top-categories-grid";
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { useGetSummaryParams } from "./_hooks/use-get-summary-params";

const MAX_DATE_RANGE_DAYS = 365;

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    params: { from, to },
    createQueryString,
  } = useGetSummaryParams();

  const { data, isLoading } = useGetSummary(from, to);

  const handleDateRangeChange = ({ from, to }: DateRange) => {
    if (!from || !to) {
      return;
    }

    if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
      toast.error(
        `日付の範囲は${MAX_DATE_RANGE_DAYS}日以内で入力してください。`,
      );
      return;
    }

    router.push(pathname + "?" + createQueryString({ from, to }));
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="mb-8">
        <DateRangePicker from={from} to={to} onUpdate={handleDateRangeChange} />
      </div>
      <DataGrid data={data} isLoading={isLoading} dateRange={{ from, to }} />
      <TopCategoriesGrid data={data} isLoading={isLoading} />
      <DataCharts data={data} isLoading={isLoading} />
    </div>
  );
}

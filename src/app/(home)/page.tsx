"use client";

import { differenceInDays, endOfMonth, format, startOfMonth } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { TopCategoriesGrid } from "@/components/top-categories-grid";
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

const MAX_DATE_RANGE_DAYS = 365;

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const from = new Date(searchParams.get("from") ?? startOfMonth(new Date()));
  const to = new Date(searchParams.get("to") ?? endOfMonth(new Date()));

  const { data, isLoading } = useGetSummary({
    from: format(from, "yyyy-MM-dd"),
    to: format(to, "yyyy-MM-dd"),
  });

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

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("to", format(to, "yyyy-MM-dd"));
    router.push(pathname + "?" + params.toString());
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

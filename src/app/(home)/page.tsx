"use client";

import { differenceInDays, format, startOfMonth } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { TopCategoriesGrid } from "@/components/top-categories-grid";
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";

const MAX_DATE_RANGE_DAYS = 365;

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? startOfMonth(new Date());
  const to = searchParams.get("to") ?? new Date();
  console.log(from, to);

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
        <DateRangePicker
          initialDateFrom={from}
          initialDateTo={to}
          onUpdate={handleDateRangeChange}
        />
      </div>
      <DataGrid />
      <TopCategoriesGrid />
      <DataCharts />
    </div>
  );
}

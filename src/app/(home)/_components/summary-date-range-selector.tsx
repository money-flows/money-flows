"use client";

import { differenceInDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";

import { createQueryString } from "../_utils/search-params";

const MAX_DATE_RANGE_DAYS = 365;

interface SummaryDateRangePickerProps {
  from: Date;
  to: Date;
}

export function SummaryDateRangePicker({
  from,
  to,
}: SummaryDateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();

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
    <DateRangePicker from={from} to={to} onUpdate={handleDateRangeChange} />
  );
}

"use client";

import { differenceInDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import { WelcomeMessage } from "@/app/(home)/_components/welcome-message";
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";
import { SignedInSuspense } from "@/features/auth/components/signed-in-suspense";

import { DataCardGrid } from "./_components/data-card-grid";
import { DataCardGridLoading } from "./_components/data-card-grid-loading";
import { useGetSummaryParams } from "./_hooks/use-get-summary-params";

const MAX_DATE_RANGE_DAYS = 365;

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    params: { from, to },
    createQueryString,
  } = useGetSummaryParams();

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
      <div className="mb-6">
        <WelcomeMessage />
      </div>
      <div className="mb-8">
        <DateRangePicker from={from} to={to} onUpdate={handleDateRangeChange} />
      </div>
      <Suspense fallback={<DataCardGridLoading />}>
        <SignedInSuspense>
          <DataCardGrid from={from} to={to} />
        </SignedInSuspense>
      </Suspense>
    </div>
  );
}

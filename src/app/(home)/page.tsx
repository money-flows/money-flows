import { SignedIn } from "@clerk/nextjs";
import { Suspense } from "react";

import { WelcomeMessage } from "@/app/(home)/_components/welcome-message";

import { DataCardGrid } from "./_components/data-card-grid";
import { DataCardGridLoading } from "./_components/data-card-grid-loading";
import { SummaryDateRangePicker } from "./_components/summary-date-range-selector";
import { WelcomeMessageLoading } from "./_components/welcome-message-loading";
import { parseSearchParams, SummarySearchParams } from "./_utils/search-params";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: SummarySearchParams;
}) {
  const { from, to } = parseSearchParams(searchParams);

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="mb-6">
        <Suspense fallback={<WelcomeMessageLoading />}>
          <WelcomeMessage />
        </Suspense>
      </div>
      <div className="mb-8">
        <SummaryDateRangePicker from={from} to={to} />
      </div>
      <Suspense fallback={<DataCardGridLoading />}>
        <SignedIn>
          <DataCardGrid from={from} to={to} />
        </SignedIn>
      </Suspense>
    </div>
  );
}

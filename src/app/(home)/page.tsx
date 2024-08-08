import { WelcomeMessage } from "@/app/(home)/_components/welcome-message";

import { DataCardGridContainer } from "./_components/data-card-grid-container";
import { SummaryDateRangePicker } from "./_components/summary-date-range-selector";
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
        <WelcomeMessage />
      </div>
      <div className="mb-8">
        <SummaryDateRangePicker from={from} to={to} />
      </div>
      <DataCardGridContainer from={from} to={to} />
    </div>
  );
}

"use client";

import { WelcomeMessage } from "@/app/(home)/welcome-message";

import { DataCardGrid } from "./data-card-grid";
import { SummaryDateRangePicker } from "./summary-date-range-selector";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="mb-6">
        <WelcomeMessage />
      </div>
      <div className="mb-8">
        <SummaryDateRangePicker />
      </div>
      <DataCardGrid />
    </div>
  );
}

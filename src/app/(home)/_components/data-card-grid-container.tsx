"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense } from "react";

import { DataCardGrid } from "./data-card-grid";
import { DataCardGridLoading } from "./data-card-grid-loading";

interface DataCardGridContainerProps {
  from: Date;
  to: Date;
}

export function DataCardGridContainer({
  from,
  to,
}: DataCardGridContainerProps) {
  const user = useUser();

  if (!user.isLoaded) {
    return <DataCardGridLoading />;
  }

  return (
    <Suspense fallback={<DataCardGridLoading />}>
      <DataCardGrid from={from} to={to} />
    </Suspense>
  );
}

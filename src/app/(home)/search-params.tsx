import { endOfMonth, format, startOfMonth } from "date-fns";
import { useSearchParams } from "next/navigation";

export interface SummarySearchParams {
  from?: string;
  to: string;
}

interface ParsedSummarySearchParams {
  from: Date;
  to: Date;
}

export function useSummarySearchParams(): ParsedSummarySearchParams {
  const searchParams = useSearchParams();

  const from = new Date(searchParams.get("from") ?? startOfMonth(new Date()));
  const to = new Date(searchParams.get("to") ?? endOfMonth(new Date()));

  return {
    from,
    to,
  };
}

export function summarySearchParamsToQueryString(
  params: ParsedSummarySearchParams,
) {
  const searchParams = new URLSearchParams();

  searchParams.set("from", format(params.from, "yyyy-MM-dd"));
  searchParams.set("to", format(params.to, "yyyy-MM-dd"));

  return searchParams.toString();
}

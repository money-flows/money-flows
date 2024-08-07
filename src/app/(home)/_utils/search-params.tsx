import { endOfMonth, format, startOfMonth } from "date-fns";

export interface SummarySearchParams {
  from?: string;
  to?: string;
}

interface ParsedSummarySearchParams {
  from: Date;
  to: Date;
}

export function parseSearchParams(
  searchParams: SummarySearchParams,
): ParsedSummarySearchParams {
  const from = new Date(searchParams.from ?? startOfMonth(new Date()));
  const to = new Date(searchParams.to ?? endOfMonth(new Date()));

  return {
    from,
    to,
  };
}

export function createQueryString(params: ParsedSummarySearchParams) {
  const searchParams = new URLSearchParams();

  searchParams.set("from", format(params.from, "yyyy-MM-dd"));
  searchParams.set("to", format(params.to, "yyyy-MM-dd"));

  return searchParams.toString();
}

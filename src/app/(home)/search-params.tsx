import { endOfMonth, format, startOfMonth } from "date-fns";
import { useSearchParams } from "next/navigation";

interface SummarySearchParams {
  from: Date;
  to: Date;
}

interface UseSummarySearchParamsResult {
  searchParams: SummarySearchParams;
}

export function useSummarySearchParams(): UseSummarySearchParamsResult {
  const searchParams = useSearchParams();

  const from = new Date(searchParams.get("from") ?? startOfMonth(new Date()));
  const to = new Date(searchParams.get("to") ?? endOfMonth(new Date()));

  return {
    searchParams: {
      from,
      to,
    },
  };
}

export function toQueryString(searchParams: SummarySearchParams) {
  const params = new URLSearchParams();

  params.set("from", format(searchParams.from, "yyyy-MM-dd"));
  params.set("to", format(searchParams.to, "yyyy-MM-dd"));

  return params.toString();
}

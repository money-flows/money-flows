import { endOfMonth, format, startOfMonth } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface GetSummaryParams {
  from: Date;
  to: Date;
}

interface useGetSummaryParamsResult {
  params: GetSummaryParams;
  createQueryString: (params: GetSummaryParams) => string;
}

function parseSearchParams(searchParams: URLSearchParams): GetSummaryParams {
  const from = new Date(searchParams.get("from") ?? startOfMonth(new Date()));
  const to = new Date(searchParams.get("to") ?? endOfMonth(new Date()));

  return {
    from,
    to,
  };
}

function createQueryString(params: GetSummaryParams) {
  const searchParams = new URLSearchParams();

  searchParams.set("from", format(params.from, "yyyy-MM-dd"));
  searchParams.set("to", format(params.to, "yyyy-MM-dd"));

  return searchParams.toString();
}

export function useGetSummaryParams(): useGetSummaryParamsResult {
  const searchParams = useSearchParams();

  const { from, to } = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  return {
    params: {
      from,
      to,
    },
    createQueryString,
  };
}

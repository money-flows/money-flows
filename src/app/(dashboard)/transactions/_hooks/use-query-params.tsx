import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface SearchTransactionsParams {
  page?: number;
  accountId?: string;
  types: ("income" | "expense")[];
}

interface useSearchTransactionsParamsResult {
  params: SearchTransactionsParams;
  createQueryString: (params: SearchTransactionsParams) => string;
  includesIncome: () => boolean;
  includesExpense: () => boolean;
}

function parseSearchParams(
  searchParams: URLSearchParams,
): SearchTransactionsParams {
  const pageQueryString = searchParams.get("page") ?? "";
  const page = Number.isSafeInteger(parseInt(pageQueryString))
    ? parseInt(pageQueryString)
    : undefined;

  const accountId = searchParams.get("accountId") ?? undefined;

  const types =
    searchParams
      .get("types")
      ?.split(",")
      ?.filter((type) => type === "income" || type === "expense") ?? [];

  return {
    page,
    accountId,
    types,
  };
}

function createQueryString(params: SearchTransactionsParams) {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", params.page.toString());
  }

  if (params.accountId) {
    searchParams.set("accountId", params.accountId);
  }

  const types = [
    ...(params.types.includes("income") ? ["income"] : []),
    ...(params.types.includes("expense") ? ["expense"] : []),
  ];

  if (types.length > 0) {
    searchParams.set("types", types.join(","));
  }

  return searchParams.toString();
}

export function useSearchTransactionsParams(): useSearchTransactionsParamsResult {
  const searchParams = useSearchParams();

  const { page, accountId, types } = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  const includesIncome = useCallback(() => types.includes("income"), [types]);
  const includesExpense = useCallback(() => types.includes("expense"), [types]);

  return {
    params: {
      page,
      accountId,
      types,
    },
    createQueryString,
    includesIncome,
    includesExpense,
  };
}

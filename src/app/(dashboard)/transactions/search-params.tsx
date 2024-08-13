import { useSearchParams } from "next/navigation";

interface TransactionsSearchParams {
  page: number;
  accountId?: string;
  types: ("income" | "expense")[];
}

interface UseTransactionsSearchParamsResult {
  searchParams: TransactionsSearchParams;
  includesIncome: () => boolean;
  includesExpense: () => boolean;
}

export function useTransactionsSearchParams(): UseTransactionsSearchParamsResult {
  const searchParams = useSearchParams();

  const pageQueryString = searchParams.get("page") ?? "";
  const page = Number.isSafeInteger(parseInt(pageQueryString))
    ? parseInt(pageQueryString)
    : 1;

  const accountId = searchParams.get("accountId") ?? undefined;

  const types =
    searchParams
      .get("types")
      ?.split(",")
      ?.filter((type) => type === "income" || type === "expense") ?? [];

  const includesIncome = () => types.includes("income");
  const includesExpense = () => types.includes("expense");

  return {
    searchParams: { page, accountId, types },
    includesIncome,
    includesExpense,
  };
}

export function toQueryString(searchParams: TransactionsSearchParams) {
  const params = new URLSearchParams();

  params.set("page", searchParams.page.toString());

  if (searchParams.accountId) {
    params.set("accountId", searchParams.accountId);
  }

  const types = [
    ...(searchParams.types.includes("income") ? ["income"] : []),
    ...(searchParams.types.includes("expense") ? ["expense"] : []),
  ];

  if (types.length > 0) {
    params.set("types", types.join(","));
  }

  return params.toString();
}

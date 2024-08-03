import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactions({
  page,
  accountId,
  types,
}: {
  page?: number;
  accountId?: string;
  types: ("income" | "expense")[];
}) {
  const query = useQuery({
    queryKey: [
      "transactions",
      {
        page: page === 1 ? undefined : page,
        accountId,
        types: types.length === 0 ? ["income", "expense"] : types,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          page: page?.toString(),
          accountId,
          types: types.length > 0 ? types.join(",") : undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      return await response.json();
    },
  });

  return query;
}

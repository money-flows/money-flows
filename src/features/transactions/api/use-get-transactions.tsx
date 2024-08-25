import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactions({
  page,
  q,
  accountId,
  types,
}: {
  page: number;
  q?: string;
  accountId?: string;
  types: ("income" | "expense")[];
}) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: [
      "transactions",
      {
        page,
        q,
        accountId,
        types: types.length === 0 ? ["income", "expense"] : types,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          page: page.toString(),
          q,
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
}

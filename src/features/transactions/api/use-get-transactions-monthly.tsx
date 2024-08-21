import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactionsMonthly({
  types,
  years,
  yearlyCumulative,
}: {
  types?: ("income" | "expense")[];
  years?: number[];
  yearlyCumulative?: boolean;
}) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: [
      "transactions",
      "monthly",
      {
        types,
        years,
        yearlyCumulative,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.aggregations.monthly.$get({
        query: {
          types: types ? types.join(",") : undefined,
          years: years ? years.join(",") : undefined,
          yearly_cumulative: yearlyCumulative ? "true" : "false",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions monthly");
      }

      return await response.json();
    },
  });
}

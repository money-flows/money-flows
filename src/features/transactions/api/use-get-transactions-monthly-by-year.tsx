import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactionsMonthlyByYear({
  types,
  years,
  cumulative,
}: {
  types?: ("income" | "expense")[];
  years?: number[];
  cumulative?: boolean;
}) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: [
      "transactions",
      "monthly",
      "by-year",
      {
        types,
        years,
        cumulative,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.monthly["by-year"].$get({
        query: {
          types: types ? types.join(",") : undefined,
          years: years ? years.join(",") : undefined,
          cumulative: cumulative ? "true" : "false",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions monthly");
      }

      return await response.json();
    },
  });
}

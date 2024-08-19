import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactionsMonthly({ years }: { years?: number[] }) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: [
      "transactions",
      "monthly",
      {
        years,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.monthly.$get({
        query: {
          years: years ? years.join(",") : undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions monthly");
      }

      return await response.json();
    },
  });
}

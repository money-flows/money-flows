import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactionsDaily({
  types,
  months,
  monthlyCumulative,
  categoryIds,
}: {
  types?: ("income" | "expense")[];
  months?: { year: number; month: number }[];
  monthlyCumulative?: boolean;
  categoryIds?: string[];
}) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: [
      "transactions",
      "daily",
      {
        types,
        months,
        monthlyCumulative,
        categoryIds,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.aggregations.daily.$get({
        query: {
          types: types ? types.join(",") : undefined,
          months: months
            ? months.map(({ year, month }) => `${year}-${month}`).join(",")
            : undefined,
          monthly_cumulative: monthlyCumulative ? "true" : "false",
          category_ids:
            categoryIds && categoryIds.length > 0
              ? categoryIds.join(",")
              : undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions daily");
      }

      return await response.json();
    },
  });
}

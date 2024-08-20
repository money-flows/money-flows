import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactionsDailyByMonth({
  types,
  months,
  cumulative,
}: {
  types?: ("income" | "expense")[];
  months?: { year: number; month: number }[];
  cumulative?: boolean;
}) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: [
      "transactions",
      "daily",
      "by-month",
      {
        types,
        months,
        cumulative,
      },
    ],
    queryFn: async () => {
      const response = await client.api.transactions.daily["by-month"].$get({
        query: {
          types: types ? types.join(",") : undefined,
          months: months
            ? months.map(({ year, month }) => `${year}-${month}`).join(",")
            : undefined,
          cumulative: cumulative ? "true" : "false",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions daily");
      }

      return await response.json();
    },
  });
}

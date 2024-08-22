import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { client } from "@/lib/hono";

export function useGetTransactionsByCategory({
  types,
  from,
  to,
}: {
  types?: ("income" | "expense")[];
  from?: Date;
  to?: Date;
}) {
  return useQuery({
    queryKey: ["transactions", "by-category", { types, from, to }],
    queryFn: async () => {
      const response = await client.api.transactions.aggregations[
        "by-category"
      ].$get({
        query: {
          types: types ? types.join(",") : undefined,
          from: from ? format(from, "yyyy-MM-dd") : undefined,
          to: to ? format(to, "yyyy-MM-dd") : undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions by category");
      }

      return await response.json();
    },
  });
}

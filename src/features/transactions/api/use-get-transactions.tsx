import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactions({
  accountId,
  page,
}: {
  accountId: string;
  page: string;
}) {
  const query = useQuery({
    queryKey: ["transactions", { accountId, page }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          accountId,
          page: page.toString(),
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

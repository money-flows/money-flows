import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTransactions({
  accountId,
  page,
  types,
}: {
  accountId: string;
  page: string;
  types?: string;
}) {
  console.log("types:", types);
  const query = useQuery({
    queryKey: ["transactions", { accountId, page, types }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          accountId,
          page: page.toString(),
          types,
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

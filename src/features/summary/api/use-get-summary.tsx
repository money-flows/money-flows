import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { client } from "@/lib/hono";

export function useGetSummary(from: Date, to: Date) {
  const formattedFrom = format(from, "yyyy-MM-dd");
  const formattedTo = format(to, "yyyy-MM-dd");

  return useSuspenseQuery({
    // TODO: Check if params are needed in the query key
    queryKey: ["summary", { from: formattedFrom, to: formattedTo }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from: formattedFrom,
          to: formattedTo,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const { data } = await response.json();
      return data;
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/hono";

type RequestQuery = InferRequestType<typeof client.api.summary.$get>["query"];

export function useGetSummary(query: RequestQuery) {
  return useQuery({
    // TODO: Check if params are needed in the query key
    queryKey: ["summary", query],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: query,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const { data } = await response.json();
      return data;
    },
  });
}

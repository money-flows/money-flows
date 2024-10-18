import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTags({ types }: { types?: ("income" | "expense")[] }) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: ["tags", { types }],
    queryFn: async () => {
      const response = await client.api.tags.$get({
        query: {
          types: types?.join(","),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const { data } = await response.json();
      return data;
    },
  });
}

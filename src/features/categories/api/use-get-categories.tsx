import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetCategories({
  types,
}: {
  types?: ("income" | "expense")[];
}) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: ["categories", { types }],
    queryFn: async () => {
      const response = await client.api.categories.$get({
        query: {
          types: types?.join(","),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const { data } = await response.json();
      return data;
    },
  });
}

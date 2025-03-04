import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetTag(id?: string) {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded && !!id,
    queryKey: ["tag", { id }],
    queryFn: async () => {
      const response = await client.api.tags[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tag");
      }

      const { data } = await response.json();
      return data;
    },
  });
}

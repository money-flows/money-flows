import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export function useGetChartLayouts() {
  const user = useUser();

  return useQuery({
    enabled: user.isLoaded,
    queryKey: ["chart-layouts"],
    queryFn: async () => {
      const response = await client.api["chart-layouts"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch chart layouts");
      }

      const { data } = await response.json();
      return data;
    },
  });
}

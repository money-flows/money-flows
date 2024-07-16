import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export function useDeleteCategory(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"].$delete({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("カテゴリーを削除しました");
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // TODO: Invalidate summary and transactions queries
    },
    onError: () => {
      toast.error("カテゴリーの削除に失敗しました");
    },
  });

  return mutation;
}

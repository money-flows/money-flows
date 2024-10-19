import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.tags)[":id"]["$delete"]
>;

export function useDeleteTag(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.tags[":id"].$delete({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("タグを削除しました");
      queryClient.invalidateQueries({ queryKey: ["tag", { id }] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      // TODO: Invalidate summary and transactions queries
    },
    onError: () => {
      toast.error("タグの削除に失敗しました");
    },
  });

  return mutation;
}

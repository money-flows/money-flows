import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.tags)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tags)[":id"]["$patch"]
>["json"];

export function useEditTag(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.tags[":id"].$patch({
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("タグの情報を更新しました");
      queryClient.invalidateQueries({ queryKey: ["tag", { id }] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      // TODO: Invalidate summary and transactions queries
    },
    onError: () => {
      toast.error("タグの情報の更新に失敗しました");
    },
  });

  return mutation;
}

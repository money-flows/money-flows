import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.tags.$post>;
type RequestType = InferRequestType<typeof client.api.tags.$post>["json"];

export function useCreateTag() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.tags.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("タグを追加しました");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: () => {
      toast.error("タグの追加に失敗しました");
    },
  });

  return mutation;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("取引を追加しました");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error("取引の追加に失敗しました");
    },
  });

  return mutation;
}

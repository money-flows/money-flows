import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export function useBulkCreateTransactions() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"].$post({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("収支を追加しました");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error("収支の追加に失敗しました");
    },
  });

  return mutation;
}

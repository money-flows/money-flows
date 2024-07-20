import { z } from "zod";

import { insertTransactionSchema } from "@/app/api/[[...route]]/schema";

export const formSchema = z.object({
  amount: z.string(),
  counterparty: z.string(),
  date: z.coerce.date(),
  memo: z.string(),
  accountId: z.string(),
  categoryId: z.string(),
});

export const apiSchema = insertTransactionSchema;

export type TransactionFormValues = z.input<typeof formSchema>;
export type TransactionApiFormValues = z.input<typeof apiSchema>;

import { z } from "zod";

import { insertTransactionSchema } from "@/app/api/[[...route]]/schema";

export const formSchema = z.object({
  amount: z.string(),
  description: z.string().optional(),
  counterparty: z.string().optional(),
  date: z.coerce.date(),
  memo: z.string().optional(),
  accountId: z.string(),
  categoryId: z.string().optional(),
});

export const apiSchema = insertTransactionSchema;

export type TransactionFormValues = z.input<typeof formSchema>;
export type TransactionApiFormValues = z.input<typeof apiSchema>;

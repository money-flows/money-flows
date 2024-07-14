import { z } from "zod";

import {
  insertAccountSchema as DBInsertAccountSchema,
  insertTransactionSchema as DBInsertTransactionSchema,
} from "@/db/schema";

export const insertAccountSchema = DBInsertAccountSchema.pick({
  name: true,
});

export const insertTransactionSchema = DBInsertTransactionSchema.omit({
  id: true,
}).extend({
  date: z.string().date(),
});

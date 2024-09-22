import { z } from "zod";

import {
  insertAccountSchema as DBInsertAccountSchema,
  insertCategorySchema as DBInsertCategorySchema,
  insertChartLayoutSchema as DBInsertChartLayoutSchema,
  insertTransactionSchema as DBInsertTransactionSchema,
} from "@/db/schema";

export const insertAccountSchema = DBInsertAccountSchema.pick({
  name: true,
});

export const insertCategorySchema = DBInsertCategorySchema.pick({
  name: true,
  type: true,
});

export const insertTransactionSchema = DBInsertTransactionSchema.omit({
  id: true,
}).extend({
  date: z.string().date(),
});

export const insertChartLayoutSchema = DBInsertChartLayoutSchema.pick({
  state: true,
});

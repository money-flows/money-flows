import { z } from "zod";

import {
  insertAccountSchema as DBInsertAccountSchema,
  insertCategorySchema as DBInsertCategorySchema,
  insertChartLayoutSchema as DBInsertChartLayoutSchema,
  insertTagSchema as DBInsertTagSchema,
  insertTransactionSchema as DBInsertTransactionSchema,
} from "@/db/schema";

export const insertAccountSchema = DBInsertAccountSchema.pick({
  name: true,
});

export const insertCategorySchema = DBInsertCategorySchema.pick({
  name: true,
  type: true,
});

export const insertTagSchema = DBInsertTagSchema.pick({
  name: true,
  type: true,
});

export const insertTransactionSchema = DBInsertTransactionSchema.omit({
  id: true,
}).extend({
  date: z.string().date(),
  tagIds: z.array(z.string()).optional(),
});

export const insertChartLayoutSchema = DBInsertChartLayoutSchema.pick({
  state: true,
});

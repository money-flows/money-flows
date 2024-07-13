import { insertAccountSchema as DBInsertAccountSchema } from "@/db/schema";

export const insertAccountSchema = DBInsertAccountSchema.pick({
  name: true,
});

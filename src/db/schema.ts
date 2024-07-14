import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const accountRelation = relations(account, ({ many }) => ({
  transactions: many(transaction),
}));

export const insertAccountSchema = createInsertSchema(account);

export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => account.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const transactionRelation = relations(transaction, ({ one }) => ({
  account: one(account, {
    fields: [transaction.accountId],
    references: [account.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transaction);

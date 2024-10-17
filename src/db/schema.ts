import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
  },
  (table) => ({
    unique: unique().on(table.name, table.userId),
  }),
);

export const accountRelation = relations(account, ({ many }) => ({
  transactions: many(transaction),
}));

export const insertAccountSchema = createInsertSchema(account);

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: categoryTypeEnum("type").notNull(),
    userId: text("user_id").notNull(),
  },
  (table) => ({
    unique: unique().on(table.name, table.type, table.userId),
  }),
);

export const categoryRelation = relations(category, ({ many }) => ({
  transactions: many(transaction),
}));

export const insertCategorySchema = createInsertSchema(category);

export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: categoryTypeEnum("type").notNull(),
  userId: text("user_id").notNull(),
});

export const transactionTag = pgTable("transaction_tag", {
  transactionId: text("transaction_id").references(() => transaction.id, {
    onDelete: "cascade",
  }),
  tagId: text("tag_id").references(() => tag.id, {
    onDelete: "cascade",
  }),
});

export const tagRelation = relations(tag, ({ many }) => ({
  transactionTags: many(transactionTag),
}));

export const insertTagSchema = createInsertSchema(tag);

export const insertTransactionTagSchema = createInsertSchema(transactionTag);

export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  description: text("description"),
  counterparty: text("counterparty"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => account.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => category.id, {
    onDelete: "set null",
  }),
  memo: text("memo"),
});

export const transactionRelation = relations(transaction, ({ one, many }) => ({
  account: one(account, {
    fields: [transaction.accountId],
    references: [account.id],
  }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
  transactionTags: many(transactionTag),
}));

export const insertTransactionSchema = createInsertSchema(transaction);

export const chartLayout = pgTable("chart_layout", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  state: jsonb("state").notNull(),
});

export const insertChartLayoutSchema = createInsertSchema(chartLayout);

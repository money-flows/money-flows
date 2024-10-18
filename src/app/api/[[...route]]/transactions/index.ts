import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import {
  and,
  count,
  desc,
  eq,
  gt,
  inArray,
  like,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { Hono } from "hono";
import groupBy from "lodash/groupBy";
import { z } from "zod";

import { db } from "@/db/drizzle";
import {
  account,
  category,
  tag,
  transaction,
  transactionTag,
} from "@/db/schema";

import { insertTransactionSchema } from "../schema";
import { aggregations } from "./aggregations";

export const transactions = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        accountId: z.string().optional(),
        page: z
          .string()
          .optional()
          .transform((value) => (value ? parseInt(value) : 1)),
        q: z.string().optional(),
        types: z
          .string()
          .optional()
          .transform((value) => value?.split(","))
          .pipe(z.array(z.enum(["income", "expense"])).optional()),
        from: z
          .string()
          .optional()
          .transform((value) => (value ? new Date(value) : undefined)),
        to: z
          .string()
          .optional()
          .transform((value) => (value ? new Date(value) : undefined)),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { accountId, page, q, types, from, to } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const pageSize = 30;

      const data = await db
        .select({
          id: transaction.id,
          amount: transaction.amount,
          description: transaction.description,
          counterparty: transaction.counterparty,
          date: transaction.date,
          memo: transaction.memo,
          account: account.name,
          accountId: transaction.accountId,
          category: category.name,
          categoryId: transaction.categoryId,
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .leftJoin(category, eq(transaction.categoryId, category.id))
        .where(
          and(
            eq(account.userId, auth.userId),
            accountId ? eq(transaction.accountId, accountId) : undefined,
            q
              ? or(
                  like(transaction.description, `%${q}%`),
                  like(transaction.counterparty, `%${q}%`),
                  like(transaction.memo, `%${q}%`),
                  like(category.name, `%${q}%`),
                )
              : undefined,
            or(
              types?.includes("income") ? gt(transaction.amount, 0) : undefined,
              types?.includes("expense")
                ? lt(transaction.amount, 0)
                : undefined,
            ),
            from ? gt(transaction.date, from) : undefined,
            to ? lt(transaction.date, to) : undefined,
          ),
        )
        .orderBy(desc(transaction.date))
        .offset((page - 1) * pageSize)
        .limit(pageSize);

      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .leftJoin(category, eq(transaction.categoryId, category.id))
        .where(
          and(
            eq(account.userId, auth.userId),
            accountId ? eq(transaction.accountId, accountId) : undefined,
            q
              ? or(
                  like(transaction.description, `%${q}%`),
                  like(transaction.counterparty, `%${q}%`),
                  like(transaction.memo, `%${q}%`),
                  like(category.name, `%${q}%`),
                )
              : undefined,
            or(
              types?.includes("income") ? gt(transaction.amount, 0) : undefined,
              types?.includes("expense")
                ? lt(transaction.amount, 0)
                : undefined,
            ),
            from ? gt(transaction.date, from) : undefined,
            to ? lt(transaction.date, to) : undefined,
          ),
        );

      const transactionIds = data.map((transaction) => transaction.id);
      const tags = await db
        .select({
          transactionId: transactionTag.transactionId,
          tagId: transactionTag.tagId,
          tag: tag.name,
        })
        .from(transactionTag)
        .innerJoin(tag, eq(transactionTag.tagId, tag.id))
        .where(inArray(transactionTag.transactionId, transactionIds));

      const groupedTags = groupBy(tags, "transactionId");

      const dataWithTags = data.map((transaction) => ({
        ...transaction,
        tags:
          groupedTags[transaction.id]?.map((tag) => ({
            id: tag.tagId,
            name: tag.tag,
          })) ?? [],
      }));

      const pageCount = Math.ceil(totalCount / pageSize);

      return c.json({ data: dataWithTags, meta: { totalCount, pageCount } });
    },
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing account ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: transaction.id,
          amount: transaction.amount,
          description: transaction.description,
          counterparty: transaction.counterparty,
          date: transaction.date,
          memo: transaction.memo,
          accountId: transaction.accountId,
          categoryId: transaction.categoryId,
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .where(and(eq(account.userId, auth.userId), eq(transaction.id, id)));

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { tagIds, ...transactionValues } = values;

      const transactionId = createId();

      // TODO: use transaction (neon-http driver does not support transaction...)
      if (tagIds && tagIds.length > 0) {
        const _ = await db.insert(transactionTag).values(
          tagIds.map((tagId) => ({
            transactionId,
            tagId,
          })),
        );
      }

      const [data] = await db
        .insert(transaction)
        .values({
          id: transactionId,
          ...transactionValues,
          date: new Date(values.date),
        })
        .returning();

      return c.json({ data });
    },
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema
          .omit({
            categoryId: true,
          })
          .extend({
            category: z
              .union([
                z.object({ id: z.string() }),
                z.object({ id: z.undefined(), name: z.string() }),
              ])
              .optional(),
          }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // if ts 5.5 or later, this `as` should not be needed, but `filter` method does not infer the type well...
      const mayBeSavedCategories = Array.from(
        new Map(
          values
            .filter((value) => value.category && !value.category.id)
            .map((value) => {
              const name =
                value.category && "name" in value.category
                  ? value.category?.name
                  : "";

              const type = value.amount > 0 ? "income" : "expense";

              const category = {
                ...value.category,
                type: value.amount > 0 ? "income" : "expense",
              } as { name: string; type: "income" | "expense" };

              return [`${name}:${type}`, category];
            }),
        ).values(),
      );

      console.log({ mayBeSavedCategories });

      if (mayBeSavedCategories.length === 0) {
        const data = await db
          .insert(transaction)
          .values(
            values.map((value) => ({
              id: createId(),
              ...value,
              date: new Date(value.date),
            })),
          )
          .returning();

        return c.json({ data });
      }

      const existingCategories = await db
        .select({
          id: category.id,
          name: category.name,
          type: category.type,
        })
        .from(category)
        .where(
          and(
            eq(category.userId, auth.userId),
            inArray(
              category.name,
              mayBeSavedCategories.map((category) => category.name),
            ),
          ),
        );

      console.log({ existingCategories });

      const existingCategoryNameSet = new Set(
        existingCategories.map((category) => category.name),
      );

      const savingCategories = mayBeSavedCategories.filter(
        (category) => !existingCategoryNameSet.has(category.name),
      );

      console.log({ savingCategories });

      const allCategories = [...existingCategories];
      if (savingCategories.length > 0) {
        const savedCategories = await db
          .insert(category)
          .values(
            savingCategories.map((category) => ({
              id: createId(),
              name: category.name,
              type: category.type,
              userId: auth.userId,
            })),
          )
          .returning();

        allCategories.push(...savedCategories);
      }

      console.log({ allCategories });

      const categoryNameToIdMap = new Map(
        allCategories.map((category) => [category.name, category.id]),
      );

      const data = await db
        .insert(transaction)
        .values(
          values.map(({ date, category, ...value }) => ({
            id: createId(),
            ...value,
            date: new Date(date),
            categoryId: category
              ? (category.id ?? categoryNameToIdMap.get(category.name))
              : undefined,
          })),
        )
        .returning();

      return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTransactionSchema),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const { tagIds, ...transactionValues } = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing account ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // TODO: use transaction (neon-http driver does not support transaction...)
      if (tagIds && tagIds.length > 0) {
        await db
          .delete(transactionTag)
          .where(eq(transactionTag.transactionId, id));

        await db.insert(transactionTag).values(
          tagIds.map((tagId) => ({
            transactionId: id,
            tagId,
          })),
        );
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transaction.id })
          .from(transaction)
          .innerJoin(account, eq(transaction.accountId, account.id))
          .where(and(eq(account.userId, auth.userId), eq(transaction.id, id))),
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transaction)
        .set({
          ...transactionValues,
          date: new Date(transactionValues.date),
        })
        .where(
          inArray(
            transaction.id,
            sql`(SELECT id FROM ${transactionsToUpdate})`,
          ),
        )
        .returning();

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing account ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transaction.id })
          .from(transaction)
          .innerJoin(account, eq(transaction.accountId, account.id))
          .where(and(eq(account.userId, auth.userId), eq(transaction.id, id))),
      );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transaction)
        .where(
          inArray(
            transaction.id,
            sql`(SELECT id FROM ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: account.id,
        });

      if (!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transaction.id })
          .from(transaction)
          .innerJoin(account, eq(transaction.accountId, account.id))
          .where(
            and(
              eq(account.userId, auth.userId),
              inArray(transaction.id, values.ids),
            ),
          ),
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transaction)
        .where(
          inArray(
            transaction.id,
            sql`(SELECT id FROM ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: account.id,
        });

      return c.json({ data });
    },
  )
  .route("/aggregations", aggregations);

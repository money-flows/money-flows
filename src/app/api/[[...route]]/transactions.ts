import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { endOfMonth, isAfter, isEqual, startOfMonth } from "date-fns";
import { and, count, desc, eq, gt, inArray, lt, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import groupBy from "lodash/groupBy";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { account, category, transaction } from "@/db/schema";

import { insertTransactionSchema } from "./schema";

const aggregations = new Hono()
  .get(
    "/monthly",
    clerkMiddleware(),
    zValidator(
      "query",
      z
        .object({
          types: z
            .string()
            .optional()
            .transform((value) => value?.split(","))
            .pipe(z.array(z.enum(["income", "expense"])).optional()),
          years: z
            .string()
            .optional()
            .transform((value) => value?.split(",").map(Number)),
          yearly_cumulative: z
            .string()
            .optional()
            .transform((value) => value === "true"),
        })
        .transform((query) => ({
          types: query.types,
          years: query.years,
          yearlyCumulative: query.yearly_cumulative,
        })),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { types, years, yearlyCumulative } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (years && years.length > 5) {
        return c.json({ error: "Too many years" }, 400);
      }

      const data = await db
        .select({
          year: sql`EXTRACT(YEAR FROM ${transaction.date})`.mapWith(Number),
          month: sql`EXTRACT(MONTH FROM ${transaction.date})`.mapWith(Number),
          totalAmount: sql`SUM(${transaction.amount})`.mapWith(Number),
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .where(
          and(
            eq(account.userId, auth.userId),
            or(
              types?.includes("income") ? gt(transaction.amount, 0) : undefined,
              types?.includes("expense")
                ? lt(transaction.amount, 0)
                : undefined,
            ),
            years
              ? inArray(sql`EXTRACT(YEAR FROM ${transaction.date})`, years)
              : undefined,
          ),
        )
        .groupBy(
          sql`EXTRACT(YEAR FROM ${transaction.date})`,
          sql`EXTRACT(MONTH FROM ${transaction.date})`,
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${transaction.date})`,
          sql`EXTRACT(MONTH FROM ${transaction.date})`,
        )
        .limit(12 * 5);

      if (data.length === 0) {
        return c.json({ data });
      }

      const lastMonth = {
        year: data[data.length - 1].year,
        month: data[data.length - 1].month,
      };

      const groupedByYear = Object.entries(groupBy(data, "year")).map(
        ([year, data]) => {
          return {
            year: Number(year),
            months: data.map(({ month, totalAmount }) => ({
              month,
              totalAmount,
            })),
          };
        },
      );

      const filledMissingMonths = groupedByYear.flatMap(({ year, months }) => {
        const filledLastMonth =
          year > lastMonth.year
            ? 0
            : year === lastMonth.year
              ? lastMonth.month
              : 12;

        return Array.from({ length: filledLastMonth }, (_, i) => {
          const monthData = months.find((m) => m.month === i + 1);
          return {
            year,
            month: i + 1,
            totalAmount: monthData ? monthData.totalAmount : 0,
          };
        });
      });

      if (!yearlyCumulative) {
        return c.json({ data: filledMissingMonths });
      }

      let cumulativeAmount = 0;
      let previousYear: number | undefined;
      const cumulativeData = filledMissingMonths.map(
        ({ year, month, totalAmount }) => {
          if (previousYear !== year) {
            cumulativeAmount = 0;
            previousYear = year;
          }
          cumulativeAmount += totalAmount;

          return {
            year,
            month,
            totalAmount: cumulativeAmount,
          };
        },
      );

      return c.json({ data: cumulativeData });
    },
  )
  .get(
    "/daily",
    clerkMiddleware(),
    zValidator(
      "query",
      z
        .object({
          types: z
            .string()
            .optional()
            .transform((value) => value?.split(","))
            .pipe(z.array(z.enum(["income", "expense"])).optional()),
          months: z
            .string()
            .optional()
            .transform((value) =>
              value?.split(",").map((v) => {
                const [year, month] = v.split("-");
                return { year: Number(year), month: Number(month) };
              }),
            ),
          monthly_cumulative: z
            .string()
            .optional()
            .transform((value) => value === "true"),
        })
        .transform((query) => ({
          types: query.types,
          months: query.months,
          monthlyCumulative: query.monthly_cumulative,
        })),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { types, months, monthlyCumulative } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select({
          year: sql`EXTRACT(YEAR FROM ${transaction.date})`.mapWith(Number),
          month: sql`EXTRACT(MONTH FROM ${transaction.date})`.mapWith(Number),
          date: sql`EXTRACT(DAY FROM ${transaction.date})`.mapWith(Number),
          totalAmount: sql`SUM(${transaction.amount})`.mapWith(Number),
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .where(
          and(
            eq(account.userId, auth.userId),
            or(
              types?.includes("income") ? gt(transaction.amount, 0) : undefined,
              types?.includes("expense")
                ? lt(transaction.amount, 0)
                : undefined,
            ),
            months
              ? or(
                  ...months.map(({ year, month }) =>
                    and(
                      eq(sql`EXTRACT(YEAR FROM ${transaction.date})`, year),
                      eq(sql`EXTRACT(MONTH FROM ${transaction.date})`, month),
                    ),
                  ),
                )
              : undefined,
          ),
        )
        .groupBy(
          sql`EXTRACT(YEAR FROM ${transaction.date})`,
          sql`EXTRACT(MONTH FROM ${transaction.date})`,
          sql`EXTRACT(DAY FROM ${transaction.date})`,
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${transaction.date})`,
          sql`EXTRACT(MONTH FROM ${transaction.date})`,
          sql`EXTRACT(DAY FROM ${transaction.date})`,
        );

      if (data.length === 0) {
        return c.json({ data });
      }

      const lastDate = {
        year: data[data.length - 1].year,
        month: data[data.length - 1].month,
        date: data[data.length - 1].date,
      };

      const groupedByMonth = Object.entries(
        groupBy(
          data.map((item) => ({
            yearAndMonth: `${item.year}-${item.month}`,
            ...item,
          })),
          "yearAndMonth",
        ),
      ).map(([_, data]) => {
        return {
          year: data[0].year,
          month: data[0].month,
          dates: data.map(({ date, totalAmount }) => ({
            date,
            totalAmount,
          })),
        };
      });

      const filledMissingDates = groupedByMonth.flatMap(
        ({ year, month, dates }) => {
          const targetMonth = startOfMonth(new Date(year, month - 1));
          const lastMonth = startOfMonth(
            new Date(lastDate.year, lastDate.month - 1),
          );

          const filledLastDate = isAfter(targetMonth, lastMonth)
            ? 0
            : isEqual(targetMonth, lastMonth)
              ? new Date().getDate()
              : endOfMonth(targetMonth).getDate();

          return Array.from({ length: filledLastDate }, (_, i) => {
            const dateData = dates.find((d) => d.date === i + 1);
            return {
              year,
              month,
              date: i + 1,
              totalAmount: dateData ? dateData.totalAmount : 0,
            };
          });
        },
      );

      if (!monthlyCumulative) {
        return c.json({ data: filledMissingDates });
      }

      let cumulativeAmount = 0;
      let previousMonth: { year: number; month: number } | undefined;
      const cumulativeData = filledMissingDates.map(
        ({ year, month, date, totalAmount }) => {
          if (previousMonth?.year !== year || previousMonth?.month !== month) {
            cumulativeAmount = 0;
            previousMonth = { year, month };
          }
          cumulativeAmount += totalAmount;

          return {
            year,
            month,
            date,
            totalAmount: cumulativeAmount,
          };
        },
      );

      return c.json({ data: cumulativeData });
    },
  )
  .get(
    "/by-category",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
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
      const { types, from, to } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select({
          category: category.name,
          totalAmount: sql`SUM(${transaction.amount})`.mapWith(Number),
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .leftJoin(category, eq(transaction.categoryId, category.id))
        .where(
          and(
            eq(account.userId, auth.userId),
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
        .groupBy(category.id)
        .orderBy(desc(sql`SUM(${transaction.amount})`));

      return c.json({ data });
    },
  );

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
      const { accountId, page, types, from, to } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const pageSize = 30;

      const data = await db
        .select({
          id: transaction.id,
          amount: transaction.amount,
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

      const pageCount = Math.ceil(totalCount / pageSize);

      return c.json({ data, meta: { totalCount, pageCount } });
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

      const [data] = await db
        .insert(transaction)
        .values({
          id: createId(),
          ...values,
          date: new Date(values.date),
        })
        .returning();

      return c.json({ data });
    },
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionSchema)),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing account ID" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
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
          ...values,
          date: new Date(values.date),
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

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import {
  differenceInDays,
  endOfDay,
  endOfToday,
  parse,
  startOfDay,
  subDays,
} from "date-fns";
import { and, eq, gte, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { account, transaction } from "@/db/schema";
import { calculatePercentageChange } from "@/lib/number";
import { coalesce } from "@/lib/sql";

export const summary = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const defaultTo = endOfToday();
    const defaultFrom = startOfDay(subDays(defaultTo, 30));

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = to
      ? endOfDay(parse(to, "yyyy-MM-dd", new Date()))
      : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date,
    ) {
      return await db
        .select({
          income: coalesce(
            sum(
              sql`CASE WHEN ${transaction.amount} > 0 THEN ${transaction.amount} ELSE 0 END`,
            ),
            0,
          ).mapWith(Number),
          expenses: coalesce(
            sum(
              sql`CASE WHEN ${transaction.amount} < 0 THEN ${transaction.amount} ELSE 0 END`,
            ),
            0,
          ).mapWith(Number),
          remaining: coalesce(sum(transaction.amount), 0).mapWith(Number),
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .where(
          and(
            eq(account.userId, userId),
            accountId ? eq(account.id, accountId) : undefined,
            gte(transaction.date, startDate),
            lte(transaction.date, endDate),
          ),
        );
    }

    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate,
    );

    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd,
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income,
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses,
    );
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining,
    );

    return c.json({
      data: {
        currentPeriod,
        lastPeriod,
        incomeChange,
        expensesChange,
        remainingChange,
      },
    });
  },
);

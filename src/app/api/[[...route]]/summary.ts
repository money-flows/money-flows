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
import { and, desc, eq, gt, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { account, category, transaction } from "@/db/schema";
import { fillMissingDays } from "@/lib/date";
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

    const incomeCategories = await db
      .select({
        name: category.name,
        value: sql`SUM(${transaction.amount})`.mapWith(Number),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.id))
      .innerJoin(category, eq(transaction.categoryId, category.id))
      .where(
        and(
          eq(account.userId, auth.userId),
          accountId ? eq(transaction.accountId, accountId) : undefined,
          gt(transaction.amount, 0),
          gte(transaction.date, startDate),
          lte(transaction.date, endDate),
        ),
      )
      .groupBy(category.id)
      .orderBy(desc(sql`SUM(${transaction.amount})`));

    const topIncomeCategories = incomeCategories.slice(0, 3);
    const otherIncomeCategories = incomeCategories.slice(3);
    const otherIncomeCategoriesTotal = otherIncomeCategories.reduce(
      (total, category) => total + category.value,
      0,
    );

    const finalIncomesCategories = topIncomeCategories;
    if (otherIncomeCategories.length > 0) {
      finalIncomesCategories.push({
        name: "その他",
        value: otherIncomeCategoriesTotal,
      });
    }

    const expenseCategories = await db
      .select({
        name: category.name,
        value: sql`SUM(ABS(${transaction.amount}))`.mapWith(Number),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.id))
      .innerJoin(category, eq(transaction.categoryId, category.id))
      .where(
        and(
          eq(account.userId, auth.userId),
          accountId ? eq(transaction.accountId, accountId) : undefined,
          lt(transaction.amount, 0),
          gte(transaction.date, startDate),
          lte(transaction.date, endDate),
        ),
      )
      .groupBy(category.id)
      .orderBy(desc(sql`SUM(ABS(${transaction.amount}))`));

    const topExpenseCategories = expenseCategories.slice(0, 3);
    const otherExpenseCategories = expenseCategories.slice(3);
    const otherExpenseCategoriesTotal = otherExpenseCategories.reduce(
      (total, category) => total + category.value,
      0,
    );

    const finalExpensesCategories = topExpenseCategories;
    if (otherExpenseCategories.length > 0) {
      finalExpensesCategories.push({
        name: "その他",
        value: otherExpenseCategoriesTotal,
      });
    }

    const activeDays = await db
      .select({
        date: transaction.date,
        income:
          sql`SUM(CASE WHEN ${transaction.amount} > 0 THEN ${transaction.amount} ELSE 0 END)`.mapWith(
            Number,
          ),
        expenses:
          sql`SUM(CASE WHEN ${transaction.amount} < 0 THEN ABS(${transaction.amount}) ELSE 0 END)`.mapWith(
            Number,
          ),
      })
      .from(transaction)
      .innerJoin(account, eq(transaction.accountId, account.id))
      .where(
        and(
          accountId ? eq(account.id, accountId) : undefined,
          eq(account.userId, auth.userId),
          gte(transaction.date, startDate),
          lte(transaction.date, endDate),
        ),
      )
      .groupBy(transaction.date)
      .orderBy(transaction.date);

    const days = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeCategories: finalIncomesCategories,
        expenseCategories: finalExpensesCategories,
        days,
      },
    });
  },
);

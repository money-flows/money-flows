import { neon } from "@neondatabase/serverless";
import {
  eachDayOfInterval,
  endOfToday,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";

import { account, category, transaction } from "@/db/schema";

type Account = typeof account.$inferSelect;
type Category = typeof category.$inferSelect;
type Transaction = typeof transaction.$inferSelect;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

if (!process.env.TEST_USER_ID) {
  throw new Error("TEST_USER_ID is missing");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

function generateRandomAmount(category: Category) {
  switch (category.name) {
    case "食費":
      return Math.floor(Math.random() * 1000) + 500;
    case "交通費":
      return Math.floor(Math.random() * 300) + 200;
    case "娯楽":
      return Math.floor(Math.random() * 3000) + 500;
    case "衣類":
      return Math.floor(Math.random() * 5000) + 1000;
    default:
      throw new Error(`Unknown category: ${category.name}`);
  }
}

function generateDailyTransactions(
  day: Date,
  accounts: Account[],
  categories: Category[],
): Transaction[] {
  const transactionCount = Math.floor(Math.random() * 5); // 0-4 transactions per day

  return Array.from({ length: transactionCount }).map((_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const accountId = accounts[Math.floor(Math.random() * accounts.length)].id;

    const isExpense = Math.random() < 0.6;
    const amount = generateRandomAmount(category) * (isExpense ? -1 : 1);

    return {
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId,
      date: day,
      amount,
      description: "内容",
      counterparty: "商人",
      categoryId: category.id,
      memo: "初期データ",
    };
  });
}

function generateTransactions(accounts: Account[], categories: Category[]) {
  const endDate = endOfToday();
  const startDate = startOfDay(subDays(endDate, 90));
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.flatMap((day) =>
    generateDailyTransactions(day, accounts, categories),
  );
}

const SEED_ACCOUNTS: Account[] = [
  {
    id: "account_1",
    name: "クレジットカード",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "account_2",
    name: "現金",
    userId: process.env.TEST_USER_ID,
  },
];

const SEED_CATEGORIES: Category[] = [
  {
    id: "category_1",
    name: "食費",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_2",
    name: "交通費",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_3",
    name: "娯楽",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_4",
    name: "衣類",
    userId: process.env.TEST_USER_ID,
  },
];

const SEED_TRANSACTIONS: Transaction[] = generateTransactions(
  SEED_ACCOUNTS,
  SEED_CATEGORIES,
);

async function main() {
  try {
    // Reset database
    await db.delete(transaction).execute();
    await db.delete(account).execute();
    await db.delete(category).execute();
    // Seed transactions
    await db.insert(category).values(SEED_CATEGORIES).execute();
    // Seed accounts
    await db.insert(account).values(SEED_ACCOUNTS).execute();
    // Seed transactions
    await db.insert(transaction).values(SEED_TRANSACTIONS).execute();
  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
}

main();

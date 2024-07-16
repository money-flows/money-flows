import { neon } from "@neondatabase/serverless";
import {
  eachDayOfInterval,
  endOfToday,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";

import { account, transaction } from "@/db/schema";

type Account = typeof account.$inferSelect;
type Transaction = typeof transaction.$inferSelect;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

if (!process.env.TEST_USER_ID) {
  throw new Error("TEST_USER_ID is missing");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

function generateIncomeAmount() {
  // Generate a random amount between 100,000 and 300,000
  return Math.round(Math.random() * 200_000 + 100_000);
}

function generateExpenseAmount() {
  const randomValue = Math.random();

  const isCheap = randomValue < 0.3;
  if (isCheap) {
    // Generate a random amount between -100 and -1,000
    return Math.round(Math.random() * -900 - 100);
  }

  const isExpensive = randomValue > 0.8;
  if (isExpensive) {
    // Generate a random amount between -10,000 and -30,000
    return Math.round(Math.random() * -20_000 - 10_000);
  }

  // Generate a random amount between -100 and -10,000
  return Math.round(Math.random() * -9_900 - 100);
}

function generateDailyTransactions(
  day: Date,
  accounts: Account[],
): Transaction[] {
  const transactionCount = Math.floor(Math.random() * 3); // 0-2 transactions per day

  return Array.from({ length: transactionCount }).map((_, i) => {
    const accountId = accounts[Math.floor(Math.random() * accounts.length)].id;

    const isIncome = Math.random() > 0.95;
    const amount = isIncome ? generateIncomeAmount() : generateExpenseAmount();

    return {
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId,
      date: day,
      amount,
      counterparty: "商人",
      categoryId: null,
      memo: null,
    };
  });
}

function generateTransactions(accounts: Account[]) {
  const endDate = endOfToday();
  const startDate = startOfDay(subDays(endDate, 90));
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.flatMap((day) => generateDailyTransactions(day, accounts));
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

const SEED_TRANSACTIONS: Transaction[] = generateTransactions(SEED_ACCOUNTS);

async function main() {
  try {
    // Reset database
    await db.delete(transaction).execute();
    await db.delete(account).execute();
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

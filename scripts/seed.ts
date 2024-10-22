import { neon } from "@neondatabase/serverless";
import {
  eachDayOfInterval,
  endOfToday,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";
import uniqBy from "lodash/uniqBy";

import {
  account,
  category,
  chartLayout,
  tag,
  transaction,
  transactionTag,
} from "@/db/schema";

type Account = typeof account.$inferSelect;
type Category = typeof category.$inferSelect;
type Tag = typeof tag.$inferSelect;
type Transaction = typeof transaction.$inferSelect;
type TransactionTag = typeof transactionTag.$inferSelect;

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
    case "給与":
      return Math.floor(Math.random() * 10000) + 20000;
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
  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return Array.from({ length: transactionCount }).map((_, i) => {
    const accountId = accounts[Math.floor(Math.random() * accounts.length)].id;

    const isExpense = Math.random() < 0.6;
    const category = isExpense
      ? expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
      : incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
    const amount = generateRandomAmount(category) * (isExpense ? -1 : 1);

    return {
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId,
      date: day,
      amount,
      description: "内容",
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

function generateTransactionTags(
  transactions: Transaction[],
  tags: Tag[],
): TransactionTag[] {
  const expenseTags = tags.filter((t) => t.type === "expense");
  const incomeTags = tags.filter((t) => t.type === "income");

  const transactionTags = transactions.flatMap((transaction) => {
    const tagCount = Math.floor(Math.random() * 3); // 0-2 tags per transaction
    return Array.from({ length: tagCount }).map(() => {
      const tag =
        transaction.amount > 0
          ? incomeTags[Math.floor(Math.random() * incomeTags.length)]
          : expenseTags[Math.floor(Math.random() * expenseTags.length)];

      return {
        transactionId: transaction.id,
        tagId: tag.id,
      };
    });
  });

  return uniqBy(
    transactionTags,
    (transactionTag) =>
      `${transactionTag.transactionId}-${transactionTag.tagId}`,
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
    type: "expense",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_2",
    name: "交通費",
    type: "expense",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_3",
    name: "娯楽",
    type: "expense",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_4",
    name: "衣類",
    type: "expense",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "category_5",
    name: "給与",
    type: "income",
    userId: process.env.TEST_USER_ID,
  },
];

const SEED_TAGS: Tag[] = [
  {
    id: "tag_1",
    name: "固定費",
    type: "expense",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "tag_2",
    name: "サブスクリプション",
    type: "expense",
    userId: process.env.TEST_USER_ID,
  },
  {
    id: "tag_3",
    name: "タグ3",
    type: "income",
    userId: process.env.TEST_USER_ID,
  },
];

const SEED_TRANSACTIONS: Transaction[] = generateTransactions(
  SEED_ACCOUNTS,
  SEED_CATEGORIES,
);

const SEED_TRANSACTION_TAGS: TransactionTag[] = generateTransactionTags(
  SEED_TRANSACTIONS,
  SEED_TAGS,
);

async function main() {
  try {
    // Reset database
    await db.delete(tag).execute();
    await db.delete(transaction).execute();
    await db.delete(account).execute();
    await db.delete(category).execute();
    await db.delete(chartLayout).execute();
    // Seed transactions
    await db.insert(category).values(SEED_CATEGORIES).execute();
    // Seed accounts
    await db.insert(account).values(SEED_ACCOUNTS).execute();
    // Seed transactions
    await db.insert(transaction).values(SEED_TRANSACTIONS).execute();
    // Seed tags
    await db.insert(tag).values(SEED_TAGS).execute();
    // Seed transaction tags
    await db.insert(transactionTag).values(SEED_TRANSACTION_TAGS).execute();
  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
}

main();

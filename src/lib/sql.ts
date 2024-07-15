import { SQL, sql } from "drizzle-orm";

export function coalesce<T>(
  value: SQL.Aliased<T> | SQL<T>,
  defaultValue: unknown,
) {
  return sql<T>`coalesce(${value}, ${defaultValue})`;
}

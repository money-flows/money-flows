import { endOfToday, format, startOfDay, subDays } from "date-fns";

export function getWeekday(
  date: Date | string,
  format: "long" | "short" = "long",
) {
  return Intl.DateTimeFormat("ja-JP", { weekday: format }).format(
    new Date(date),
  );
}

interface Period {
  from: string | Date | undefined;
  to: string | Date | undefined;
}

export function formatDateRange(period?: Period) {
  const defaultTo = endOfToday();
  const defaultFrom = startOfDay(subDays(defaultTo, 30));

  if (!period?.from) {
    return `${format(defaultFrom, "yyyy/MM/dd")} - ${format(defaultTo, "yyyy/MM/dd")}`;
  }

  if (period.to) {
    return `${format(period.from, "yyyy/MM/dd")} - ${format(period.to, "yyyy/MM/dd")}`;
  }

  return format(period.from, "yyyy/MM/dd");
}

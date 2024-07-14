export function getWeekday(
  date: Date | string,
  format: "long" | "short" = "long",
) {
  return Intl.DateTimeFormat("ja-JP", { weekday: format }).format(
    new Date(date),
  );
}

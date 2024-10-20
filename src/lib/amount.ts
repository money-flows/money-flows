export function formatCurrency(value: number) {
  return Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    currencyDisplay: "name",
  }).format(value);
}

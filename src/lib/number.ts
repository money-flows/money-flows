export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  const percentage = ((current - previous) / previous) * 100;
  return Math.round(percentage);
}

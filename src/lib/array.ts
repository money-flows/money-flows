export function range(start: number, end: number) {
  return [...Array(end - start).keys()].map((i) => i + start);
}

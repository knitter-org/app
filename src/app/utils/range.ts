export function rangeInclusive(start: number, end: number) {
  return Array.apply(0, Array(end - start))
    .map((_, index) => index + start);
}

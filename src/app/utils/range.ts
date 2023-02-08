export function rangeEndInclusive(start: number, end: number) {
  return Array.apply(0, Array(end - start))
    .map((_, index) => index + start + 1);
}

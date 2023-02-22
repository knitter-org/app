export function replaceElement<T>(arr: T[], victim: T, successor: T): T[] {
  const index = arr.indexOf(victim);
  if (index === -1) {
    throw 'victim not found in list';
  }

  const copy = [...arr];
  copy[index] = successor;
  return copy;
}

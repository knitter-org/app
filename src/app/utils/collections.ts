import { Doc } from "app/services/database.models";

export function docsToIdMap<T extends Doc>(docs: T[]): Map<string, T> {
  const map = new Map();
  docs.forEach((doc) => {
    map.set(doc._id, doc);
  });
  return map;
}

export function replaceElement<T>(arr: T[], victim: T, successor: T): T[] {
  const index = arr.indexOf(victim);
  if (index === -1) {
    throw 'victim not found in list';
  }

  const copy = [...arr];
  copy[index] = successor;
  return copy;
}

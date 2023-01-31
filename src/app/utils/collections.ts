import { Doc } from "app/services/database.models";
import { Map } from 'immutable';

export function docsToIdMap<T extends Doc>(docs: T[]): Map<string, T> {
  return Map(docs.map((doc) => [doc._id, doc]));
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

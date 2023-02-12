import { faker } from '@faker-js/faker';
import { Entry } from 'app/services/database.models';

export function produceEntry(partial: Partial<Entry> = {}): Entry {
  return {
    id: faker.datatype.hexadecimal({ prefix: '', length: 8 }),
    publishedAt: faker.date.past(2),
    title: faker.random.words(5),
    text: faker.lorem.text(),
    url: faker.internet.url(),
    ...partial,
  };
}

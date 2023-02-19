import { faker } from '@faker-js/faker';
import { Feed } from 'app/services/database.models';

export function produceFeed(partial: Partial<Feed> = {}): Feed {
  return {
    id: faker.datatype.hexadecimal({ prefix: '', length: 8 }),
    rev: faker.random.alphaNumeric(10),
    title: faker.random.words(5),
    url: faker.internet.url(),
    fetch: {
      lastSuccessfulAt: faker.date.past(1),
      intervalMinutes: 1440,
    },
    retention: { strategy: 'keep-forever' },
    ...partial,
  };
}

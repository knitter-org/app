import { faker } from '@faker-js/faker';
import { Entry } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';

export function produceEntry(partial: Partial<Entry> = {}): Entry {
  return {
    id: faker.datatype.hexadecimal({ prefix: '', length: 8 }),
    feedId: FeedService.generateFeedId(faker.internet.url()),
    publishedAt: faker.date.past(2),
    title: faker.random.words(5),
    text: faker.lorem.text(),
    url: faker.internet.url(),
    ...partial,
  };
}

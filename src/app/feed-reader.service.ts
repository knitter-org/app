import { Injectable } from '@angular/core';
import { read } from '@extractus/feed-extractor'

export interface FeedFetchResult {
  title: string,
  entries: {
    title: string,
    text: string,
    publishedAt: Date,
    url: string,
  }[],
}

@Injectable({
  providedIn: 'root'
})
export class FeedReaderService {

  constructor(
  ) {}

  async fetchFeed(url: string): Promise<FeedFetchResult> {
    let result;
    try {
      result = await read(url, undefined, { headers: [] });
    } catch (e) {
      result = await read('https://api.allorigins.win/get?url='+url, undefined, { headers: [] });
    }

    const entries = result.entries!.map(entry => ({
      title: entry.title!,
      text: entry.description!,
      publishedAt: entry.published!,
      url: entry.link!,
    }));

    console.log(entries);

    return {
      title: result.title || url,
      entries,
    };
  }
}

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

  async fetchFeed(url: string): Promise<FeedFetchResult> {
    const result = await read(url, undefined, { headers: [] });

    const entries = result.entries!.map(entry => ({
      title: entry.title!,
      text: entry.description!,
      publishedAt: new Date(entry.published!),
      url: entry.link!,
    }));

    return {
      title: result.title || url,
      entries,
    };
  }
}

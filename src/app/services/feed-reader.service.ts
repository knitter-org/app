import { Injectable } from '@angular/core';
import { extract } from '@extractus/feed-extractor'
import { FeedProxySettingsDoc } from './database.models';
import { DatabaseService } from './database.service';

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

  constructor(private databaseService: DatabaseService) {}

  async fetchFeed(url: string): Promise<FeedFetchResult> {
    try {
      const { proxyUrl }: FeedProxySettingsDoc = await this.databaseService.db.get('settings:feed-proxy');
      const base64Url = btoa(url);
      url = `${proxyUrl}/${base64Url}`;
    } catch (e) {
      console.log(e);
    }

    return this.fetchFeedInternal(url);
  }

  private async fetchFeedInternal(url: string): Promise<FeedFetchResult> {
    const result = await extract(url, undefined, { headers: [] });

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

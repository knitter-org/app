import { Injectable } from '@angular/core';
import { concatAll, filter, interval, switchMap } from 'rxjs';
import { FeedDoc } from './database.models';
import { FeedService } from './feed.service';

const SCHEULDER_INTERVAL_SECONDS = 60;

@Injectable({
  providedIn: 'root'
})
export class ScheduledFeedFetcherService {

  constructor(private feedService: FeedService) {
    this.setupScheduler();
  }

  private setupScheduler() {
    interval(SCHEULDER_INTERVAL_SECONDS * 1000).pipe(
      switchMap(_ => this.feedService.getFeeds()),
      concatAll(),
      filter(feedDoc => this.isFetchDue(feedDoc)),
    )
    .subscribe(feedDoc => this.feedService.fetchEntries(feedDoc._id));
  }

  private isFetchDue(feedDoc: FeedDoc): boolean {
    const dueDate = new Date(feedDoc.fetch.lastSuccessfulAt.getTime() + feedDoc.fetch.intervalMinutes * 60000);
    return dueDate <= new Date();
  }
}

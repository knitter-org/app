import { Injectable } from '@angular/core';
import { MigrationService } from 'app/pages/migration/migration.service';
import { concatAll, filter, interval, switchMap, tap } from 'rxjs';
import { Feed } from './database.models';
import { FeedService } from './feed.service';

const SCHEULDER_INTERVAL_SECONDS = 60;

@Injectable({
  providedIn: 'root'
})
export class ScheduledFeedFetcherService {

  constructor(private feedService: FeedService, private migrationService: MigrationService) {
    this.setupScheduler();
  }

  private setupScheduler() {
    interval(SCHEULDER_INTERVAL_SECONDS * 1000).pipe(
      switchMap(() => this.migrationService.needsMigration()),
      filter(needsMigration => !needsMigration),
      switchMap(_ => this.feedService.getFeeds()),
      concatAll(),
      filter(feed => this.isFetchDue(feed)),
    )
    .subscribe(feed => this.feedService.fetchEntries(feed.id));
  }

  private isFetchDue(feed: Feed): boolean {
    const dueDate = new Date(feed.fetch.lastSuccessfulAt.getTime() + feed.fetch.intervalMinutes * 60000);
    return dueDate <= new Date();
  }
}

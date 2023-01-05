import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';
import { EntryDoc, FeedDoc } from 'src/app/database.models';
import { EntryService } from 'src/app/entry.service';
import { FeedService } from 'src/app/feed.service';

@Component({
  selector: 'app-feeds-view',
  templateUrl: './feeds-view.component.html',
  styleUrls: ['./feeds-view.component.less']
})
export class FeedsViewComponent {
  fetchIcon = faArrowsRotate;

  feedId$ = new BehaviorSubject<string|undefined>(undefined);
  feed$: Observable<FeedDoc>;
  entries$: Observable<EntryDoc[]>;

  constructor(
    route: ActivatedRoute,
    private feedService: FeedService,
    private entryService: EntryService
  ) {
    route.params.pipe(map(params => params['id'])).subscribe(this.feedId$);
    this.feed$ = this.feedId$.pipe(mergeMap(feedId => this.feedService.getFeed(feedId!)));
    this.entries$ = this.feedId$.pipe(mergeMap(feedId => this.entryService.entriesForFeed(feedId!)));
  }

  async forceFetch() {
    await this.feedService.fetchEntries(this.feedId$.value!);
  }
}

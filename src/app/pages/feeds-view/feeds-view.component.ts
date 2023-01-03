import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import { EntryDoc, FeedDoc } from 'src/app/database.models';
import { EntryService } from 'src/app/entry.service';
import { FeedService } from 'src/app/feed.service';

@Component({
  selector: 'app-feeds-view',
  templateUrl: './feeds-view.component.html',
  styleUrls: ['./feeds-view.component.less']
})
export class FeedsViewComponent {
  
  feed$: Observable<FeedDoc>;
  entries$: Observable<EntryDoc[]>;

  constructor(
    route: ActivatedRoute,
    private feedService: FeedService,
    private entryService: EntryService
  ) {
    const feedId$ = route.params.pipe(map(params => params['id']));
    this.feed$ = feedId$.pipe(mergeMap(feedId => this.feedService.getFeed(feedId)));
    this.entries$ = feedId$.pipe(mergeMap(feedId => this.entryService.entriesForFeed(feedId)));
  }
}

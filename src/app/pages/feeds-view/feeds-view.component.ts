import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowsRotate, faEdit } from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';
import { EntryDoc, FeedDoc } from 'app/services/database.models';
import { EntryService } from 'app/services/entry.service';
import { FeedService } from 'app/services/feed.service';

@UntilDestroy()
@Component({
  selector: 'app-feeds-view',
  templateUrl: './feeds-view.component.html',
  styleUrls: ['./feeds-view.component.less']
})
export class FeedsViewComponent {
  fetchIcon = faArrowsRotate;
  editIcon = faEdit;

  feedId$ = new BehaviorSubject<string|undefined>(undefined);
  feed$: Observable<FeedDoc>;
  entries$: Observable<EntryDoc[]>;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private feedService: FeedService,
    private entryService: EntryService
  ) {
    route.params.pipe(untilDestroyed(this), map(params => params['id'])).subscribe(this.feedId$);
    this.feed$ = this.feedId$.pipe(mergeMap(feedId => this.feedService.getFeed(feedId!)));
    this.entries$ = this.feedId$.pipe(mergeMap(feedId => this.entryService.entriesForFeed(feedId!)));
  }

  async forceFetch() {
    await this.feedService.fetchEntries(this.feedId$.value!);
    this.feedId$.next(this.feedId$.value);
  }
  async editFeed() {
    this.router.navigate(['feeds', this.feedId$.value, 'edit']);
  }
}

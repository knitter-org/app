import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowsRotate, faEdit } from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, map, mergeMap, Observable, switchMap } from 'rxjs';
import { Feed, Entry } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { FeedViewRepository } from './feed-view.store';

@UntilDestroy()
@Component({
  selector: 'app-feeds-view',
  templateUrl: './feeds-view.component.html',
  styleUrls: ['./feeds-view.component.less'],
  providers: [FeedViewRepository],
})
export class FeedsViewComponent implements OnInit {
  fetchIcon = faArrowsRotate;
  editIcon = faEdit;

  isLoading$: Observable<boolean> = this.feedViewRepo.isLoading$();
  feed$: Observable<Feed> = this.feedViewRepo.feed$();
  entries$: Observable<Entry[]> = this.feedViewRepo.entries$();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedViewRepo: FeedViewRepository
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => params['id']),
        untilDestroyed(this)
      )
      .subscribe((feedId) => this.feedViewRepo.loadFeed(feedId));
  }

  async forceFetch() {
    // await this.feedService.fetchEntries(this.feedId$.value!);
    // this.feedId$.next(this.feedId$.value);
  }
  async editFeed() {
    // this.router.navigate(['feeds', this.feedId$.value, 'edit']);
  }

  onEntryRead(entry: Entry) {
    console.log('TODO implement entry read', entry);
    // this.channelViewStore.markEntryAsRead(entryDoc);
  }
}

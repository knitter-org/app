import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowsRotate, faEdit } from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Entry, Feed } from 'app/services/database.models';
import { map, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { FeedViewRepository } from './feed-view.store';

@UntilDestroy()
@Component({
  selector: 'app-feeds-view',
  templateUrl: './feeds-view.component.html',
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
    alert('todo');
    // const feed = await firstValueFrom(this.feed$);
    // await this.feedService.fetchEntries(this.feedId$.value!);
    // this.feedId$.next(this.feedId$.value);
  }

  async editFeed() {
    const feed = await firstValueFrom(this.feed$);
    this.router.navigate(['feeds', feed.id, 'edit']);
  }

  onEntryRead(entry: Entry) {
    this.feedViewRepo.markEntryAsRead(entry);
  }
}

import { Component } from '@angular/core';
import {
  faGear, faNewspaper, faPlus, faRss
} from '@fortawesome/free-solid-svg-icons';
import { FeedsRepository } from 'app/state/feeds.store';
import { map } from 'rxjs';

@Component({
  selector: 'app-vertical-nav',
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.less'],
})
export class VerticalNavComponent {
  faGear = faGear;
  faRss = faRss;
  faPlus = faPlus;
  faNewspaper = faNewspaper;

  readonly feedsVm$ = this.feedsRepo.feeds$.pipe(map(feeds => feeds.map(feed => ({
    id: feed.id, title: feed.title, unreadEntriesCount: 0
  }))));

  constructor(
    private feedsRepo: FeedsRepository,
  ) {}
}

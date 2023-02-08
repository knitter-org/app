import { Component, OnInit } from '@angular/core';
import {
  faGear, faNewspaper, faPlus, faRss
} from '@fortawesome/free-solid-svg-icons';
import { FeedService } from 'app/services/feed.service';
import { FeedsStore } from 'app/state/feeds.store';
import { VerticalNavStore } from './vertical-nav.store';

@Component({
  selector: 'app-vertical-nav',
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.less'],
  providers: [VerticalNavStore],
})
export class VerticalNavComponent implements OnInit {
  faGear = faGear;
  faRss = faRss;
  faPlus = faPlus;
  faNewspaper = faNewspaper;

  readonly feedsVm$ = this.componentStore.feedsVm$;

  constructor(
    private feedsStore: FeedsStore,
    private componentStore: VerticalNavStore,
    private feedService: FeedService
  ) {}

  async ngOnInit() {
    this.componentStore.fetchChannels();
  }

  async getUnreadEntryCountForFeedId(feedId: string) {
    return 0;
    // return await this.feedService.getUnreadEntryCountForFeedId(feedId);
  }
}

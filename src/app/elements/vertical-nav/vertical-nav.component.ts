import { Component, OnInit } from '@angular/core';
import {
  faGear, faNewspaper, faPlus, faRss
} from '@fortawesome/free-solid-svg-icons';
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

  readonly feeds$ = this.feedsStore.feeds$;

  constructor(
    private feedsStore: FeedsStore,
    private componentStore: VerticalNavStore
  ) {}

  async ngOnInit() {
    this.componentStore.fetchChannels();
    // this.componentStore.fetchFeeds();
  }
}

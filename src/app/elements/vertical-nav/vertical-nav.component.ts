import { Component, OnInit } from '@angular/core';
import { faGear, faRss, faPlus, faNewspaper }  from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
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

  readonly channels$ = this.store.state$.pipe(
    map((state) => state.channels)
  );

  readonly feedsAndStatus$ = this.store.state$.pipe(
    map((state) => state.feedsAndStatus)
  );

  constructor(private store: VerticalNavStore) {}

  async ngOnInit() {
    this.store.fetchChannels();
    this.store.fetchFeeds();
  }
}

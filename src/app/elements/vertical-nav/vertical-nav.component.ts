import { Component, OnInit } from '@angular/core';
import { FeedData } from '@extractus/feed-extractor';
import { faGear, faRss, faPlus, faNewspaper }  from '@fortawesome/free-solid-svg-icons';
import { from, Observable } from 'rxjs';
import { FeedDoc } from 'src/app/database.models';
import { FeedService } from 'src/app/feed.service';

@Component({
  selector: 'app-vertical-nav',
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.less']
})
export class VerticalNavComponent implements OnInit {
  faGear = faGear;
  faRss = faRss;
  faPlus = faPlus;
  faNewspaper = faNewspaper;

  feeds$: Observable<FeedDoc[]> | undefined;

  constructor(private feedService: FeedService) {}
  
  async ngOnInit() {
    this.feeds$ = from(this.feedService.getFeeds());
  }
}

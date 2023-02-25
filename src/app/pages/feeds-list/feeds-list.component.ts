import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FeedsRepository } from 'app/state/feeds.store';
import { map } from 'rxjs';

@Component({
  selector: 'app-feeds-list',
  templateUrl: './feeds-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class FeedsListComponent {
  faPlus = faPlus;

  readonly feedsVm$ = this.feedsRepo.feeds$.pipe(map(feeds => feeds.map(feed => ({
    id: feed.id, title: feed.title, unreadEntriesCount: 0
  }))));

  constructor(
    private feedsRepo: FeedsRepository,
  ) {}
}

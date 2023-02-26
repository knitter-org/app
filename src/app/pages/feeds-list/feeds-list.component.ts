import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FeedsListRepository } from './feeds-list.store';

@Component({
  selector: 'app-feeds-list',
  templateUrl: './feeds-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  providers: [FeedsListRepository],
})
export class FeedsListComponent {
  faPlus = faPlus;

  readonly feedVms$ = this.feedsListRepo.feedVms$();

  constructor(
    private feedsListRepo: FeedsListRepository,
  ) {}
}

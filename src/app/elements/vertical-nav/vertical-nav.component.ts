import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGear,
  faNewspaper,
  faPlus,
  faRss,
} from '@fortawesome/free-solid-svg-icons';
import { VerticalNavRepository } from './vertical-nav.store';

@Component({
  selector: 'app-vertical-nav',
  templateUrl: './vertical-nav.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  providers: [VerticalNavRepository]
})
export class VerticalNavComponent {
  faGear = faGear;
  faRss = faRss;
  faPlus = faPlus;
  faNewspaper = faNewspaper;

  readonly feedVms$ = this.verticalNavRepo.feedVms$();

  constructor(private verticalNavRepo: VerticalNavRepository) {}
}

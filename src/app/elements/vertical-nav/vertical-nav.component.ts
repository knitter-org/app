import { Component } from '@angular/core';
import { faGear, faRss, faPlus, faNewspaper }  from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vertical-nav',
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.less']
})
export class VerticalNavComponent {
  faGear = faGear;
  faRss = faRss;
  faPlus = faPlus;
  faNewspaper = faNewspaper;
}

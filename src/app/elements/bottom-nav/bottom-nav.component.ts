import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faNewspaper, faRss } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule]
})
export class BottomNavComponent {
  faGear = faGear;
  faRss = faRss;
  faNewspaper = faNewspaper;
}

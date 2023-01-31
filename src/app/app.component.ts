import { Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { FeedsStore } from './state/feeds.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [provideComponentStore(FeedsStore)],
})
export class AppComponent {
  title = 'knitter';
}

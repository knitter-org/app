import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  styleUrls: ['./channels-view.component.less']
})
export class ChannelsViewComponent {

  channelId$: Observable<string>;

  constructor(
    private route: ActivatedRoute
  ) {
    this.channelId$ = route.params.pipe(map(params => params['id']));
  }
}

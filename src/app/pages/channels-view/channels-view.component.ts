import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, Observable } from 'rxjs';
import { ChannelViewStore } from './channel-view.store';

@UntilDestroy()
@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  styleUrls: ['./channels-view.component.less'],
  providers: [ChannelViewStore],
})
export class ChannelsViewComponent implements OnInit {

  channelId$: Observable<string>;

  readonly entries$ = this.channelViewStore.state$.pipe(map(state => state.entries));

  readonly isLoading$ = this.channelViewStore.state$.pipe(map(state => state.isLoading));

  constructor(
    private route: ActivatedRoute,
    private channelViewStore: ChannelViewStore
  ) {
    this.channelId$ = this.route.params.pipe(map(params => params['id']));
    this.channelId$.pipe(untilDestroyed(this)).subscribe(channelId => this.channelViewStore.fetchEntries(channelId));
  }

  ngOnInit(): void {
  }
}

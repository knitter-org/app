import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { Entry } from 'app/services/database.models';
import { ChannelViewStore } from './channels-view.store';

@UntilDestroy()
@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  styleUrls: ['./channels-view.component.less'],
  providers: [ChannelViewStore],
})
export class ChannelsViewComponent {
  readonly channel$ = this.channelViewStore.state$.pipe(
    map((state) => state.channel)
  );

  readonly entries$ = this.channelViewStore.state$.pipe(
    map((state) => state.entries || [])
  );

  readonly isLoading$ = this.channelViewStore.state$.pipe(
    map((state) => state.isLoading)
  );

  constructor(
    route: ActivatedRoute,
    private channelViewStore: ChannelViewStore
  ) {
    const channelId$ = route.params.pipe(map((params) => params['id']));
    channelId$
      .pipe(untilDestroyed(this))
      .subscribe((channelId) => this.channelViewStore.updateForChannelId(channelId));
  }

  onEntryRead(entry: Entry) {
    console.log('TODO implement entry read', entry);
    // this.channelViewStore.markEntryAsRead(entryDoc);
  }
}

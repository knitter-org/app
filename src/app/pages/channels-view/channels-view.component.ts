import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChannelService } from 'app/services/channel.service';
import { Entry } from 'app/services/database.models';
import { map } from 'rxjs';
import { ChannelViewStore } from './channels-view.store';

@UntilDestroy()
@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  providers: [ChannelViewStore],
})
export class ChannelsViewComponent {
  readonly entries$ = this.channelViewStore.entries$;

  readonly isLoading$ = this.channelViewStore.isLoading$;

  constructor(
    route: ActivatedRoute,
    private channelViewStore: ChannelViewStore
  ) {
    route.params
      .pipe(
        map((params) => params['id']),
        untilDestroyed(this)
      )
      .subscribe((channelId) =>
        this.channelViewStore.loadChannel(ChannelService.ID_PREFIX + channelId)
      );
  }

  onEntryRead(entry: Entry) {
    this.channelViewStore.markEntryAsRead(entry);
  }
}

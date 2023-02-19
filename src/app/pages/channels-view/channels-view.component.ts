import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Entry } from 'app/services/database.models';
import { map } from 'rxjs';
import { ChannelViewStore } from './channels-view.store';

@UntilDestroy()
@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  styleUrls: ['./channels-view.component.less'],
  providers: [ChannelViewStore],
})
export class ChannelsViewComponent {
  readonly channel$ = this.channelViewStore.channel$;

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
        this.channelViewStore.updateForChannelId(channelId)
      );
  }

  onEntryRead(entry: Entry) {
    console.debug('TODO onEntryRead', entry);
    // this.channelViewStore.onEntryRead(entry);
  }
}

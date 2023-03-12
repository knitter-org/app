import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EntryListComponent } from 'app/elements/entry-list/entry-list.component';
import { ChannelService } from 'app/services/channel.service';
import { Entry } from 'app/services/database.models';
import { map } from 'rxjs';
import { ChannelViewStore } from './channels-view.store';

@UntilDestroy()
@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  standalone: true,
  imports: [CommonModule, EntryListComponent],
  providers: [ChannelViewStore],
})
export class ChannelsViewComponent implements OnInit {
  readonly entries$ = this.channelViewStore.entries$;

  readonly isLoading$ = this.channelViewStore.isLoading$;

  constructor(
    private route: ActivatedRoute,
    private channelViewStore: ChannelViewStore
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params['id']),
        untilDestroyed(this)
      )
      .subscribe((channelId) =>
        this.channelViewStore.setChannel(ChannelService.ID_PREFIX + channelId)
      );
  }

  onEntryRead(entry: Entry) {
    this.channelViewStore.markEntryAsRead(entry);
  }
}

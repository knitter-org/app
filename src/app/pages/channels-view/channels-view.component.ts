import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { ChannelService } from 'src/app/channel.service';
import { EntryDoc } from 'src/app/database.models';

@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  styleUrls: ['./channels-view.component.less']
})
export class ChannelsViewComponent implements OnInit {

  channelId$: Observable<string>;

  entries$: Observable<EntryDoc[]>;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService
  ) {
    this.channelId$ = this.route.params.pipe(map(params => params['id']));
    this.entries$ = this.channelId$.pipe(switchMap(_ => this.channelService.entiresOrderedByDate()))
  }

  ngOnInit(): void {
  }
}

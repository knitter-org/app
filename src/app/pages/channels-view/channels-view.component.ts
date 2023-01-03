import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { EntryService } from 'src/app/entry.service';

@Component({
  selector: 'app-channels-view',
  templateUrl: './channels-view.component.html',
  styleUrls: ['./channels-view.component.less']
})
export class ChannelsViewComponent implements OnInit {

  channelId$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService
  ) {
    this.channelId$ = this.route.params.pipe(map(params => params['id']));
  }

  ngOnInit(): void {
    // this.entries$ = this.channelId$.pipe(map(_ => this.entryService.entriesForFeed))
  }


}

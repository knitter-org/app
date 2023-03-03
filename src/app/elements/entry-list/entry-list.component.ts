import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { Entry } from 'app/services/database.models';
import { CommonModule } from '@angular/common';
import { FeedBadgePipe } from 'app/pipes/feed-badge.pipe';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  standalone: true,
  imports: [CommonModule, ScrollingModule, FeedBadgePipe],
  host: { class: 'flex-auto h-full' }
})
export class EntryListComponent {
  @Input() entries$?: Observable<Entry[]>;

  @Output() onRead = new EventEmitter<Entry>();
}

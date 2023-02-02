import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Entry } from 'app/services/database.models';

@Component({
  selector: 'app-entry-format-list-item',
  templateUrl: './entry-format-list-item.component.html',
  styleUrls: ['./entry-format-list-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryFormatListItemComponent {
  @Input() entry!: Entry;

  @Output() onRead = new EventEmitter();

  onEntryRead() {
    this.onRead.emit();
  }
}

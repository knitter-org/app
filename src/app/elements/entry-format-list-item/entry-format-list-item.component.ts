import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EntryDoc } from 'app/database.models';

@Component({
  selector: 'app-entry-format-list-item',
  templateUrl: './entry-format-list-item.component.html',
  styleUrls: ['./entry-format-list-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryFormatListItemComponent {

  @Input() entry!: EntryDoc;
}

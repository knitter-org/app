import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { EntryDoc } from 'app/services/database.models';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.less']
})
export class EntryListComponent {

  @Input() entries$?: Observable<EntryDoc[]>;

  @Output() onRead = new EventEmitter<EntryDoc>();

}

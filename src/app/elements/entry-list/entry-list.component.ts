import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { EntryDoc } from 'src/app/database.models';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.less']
})
export class EntryListComponent {

  @Input() entries$!: Observable<EntryDoc[]>;

}

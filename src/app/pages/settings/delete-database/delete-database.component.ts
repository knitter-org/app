import { Component } from '@angular/core';
import { DatabaseService } from 'app/services/database.service';

@Component({
  selector: 'app-delete-database',
  templateUrl: './delete-database.component.html',
  styleUrls: ['./delete-database.component.less'],
})
export class DeleteDatabaseComponent {
  constructor(private databaseService: DatabaseService) {}

  deleteLocalDatabase() {
    if (confirm('Are you sure?')) {
      this.databaseService.dropDatabase();
    }
  }
}

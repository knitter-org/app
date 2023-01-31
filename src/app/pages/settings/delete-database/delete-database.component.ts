import { Component } from '@angular/core';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { DatabaseService } from 'app/services/database.service';

@Component({
  selector: 'app-delete-database',
  templateUrl: './delete-database.component.html',
  styleUrls: ['./delete-database.component.less'],
})
export class DeleteDatabaseComponent {
  constructor(private databaseService: DatabaseService) {}

  async deleteLocalDatabase() {
    if (confirm('Are you sure?')) {
      await this.databaseService.dropDatabase();
      window.location.reload();
    }
  }
}

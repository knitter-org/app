import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SyncSettingsDoc } from 'app/services/database.models';
import { DatabaseService } from 'app/services/database.service';
import CustomValidators from 'app/utils/custom-validators';

@Component({
  selector: 'app-server-settings',
  templateUrl: './server-settings.component.html',
  styleUrls: ['./server-settings.component.less'],
})
export class ServerSettingsComponent implements OnInit {
  form = new FormGroup({
    serverUrl: new FormControl('', [CustomValidators.url]),
  });

  readonly syncStatus$ = this.databaseService.syncStatus$;

  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    try {
      const syncSettingsDoc: SyncSettingsDoc =
        await this.databaseService.db.get('settings:sync');
      this.form.patchValue({
        serverUrl: syncSettingsDoc.serverUrl,
      });
    } catch {}
  }

  async updateServerSettings() {
    const serverUrl = this.form.value.serverUrl!.trim();
    if (serverUrl) {
      await this.setupServerSync(serverUrl);
    } else {
      await this.disableServerSync();
    }
  }

  private async setupServerSync(serverUrl: string) {
    let syncSettingsDoc: SyncSettingsDoc;
    try {
      syncSettingsDoc = await this.databaseService.db.get('settings:sync');
      syncSettingsDoc.serverUrl = serverUrl;
    } catch {
      syncSettingsDoc = {
        _id: 'settings:sync',
        type: 'settings',
        serverUrl,
      };
    }

    this.databaseService.db.put(syncSettingsDoc);
    this.databaseService.startServerSync(syncSettingsDoc.serverUrl);
  }

  private async disableServerSync() {
    this.databaseService.stopServerSync();

    // Remove serverUrl if exists
    try {
      const syncSettingsDoc = await this.databaseService.db.get('settings:sync');
      await this.databaseService.db.remove(syncSettingsDoc);
    } catch {}
  }
}

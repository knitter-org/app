import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedProxySettingsDoc } from 'app/services/database.models';
import { DatabaseService } from 'app/services/database.service';
import CustomValidators from 'app/utils/custom-validators';

@Component({
  selector: 'app-feed-proxy-settings',
  templateUrl: './feed-proxy-settings.component.html',
  styleUrls: ['./feed-proxy-settings.component.less']
})
export class FeedProxySettingsComponent {

  form = new FormGroup({
    proxyUrl: new FormControl('', [CustomValidators.url]),
  });

  constructor(
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    try {
      const feedProxyDoc: FeedProxySettingsDoc = await this.databaseService.db.get('settings:feed-proxy');
      this.form.patchValue({
        proxyUrl: feedProxyDoc.proxyUrl,
      });
    } catch {}
  }

  async updateFeedProxySettings() {
    const proxyUrl = this.form.value.proxyUrl?.trim();

    if (proxyUrl) {
      // Save/update proxyUrl
      let feedProxyDoc: FeedProxySettingsDoc;
      try {
        feedProxyDoc = await this.databaseService.db.get('settings:feed-proxy');
        feedProxyDoc.proxyUrl = proxyUrl;
      } catch {
        feedProxyDoc = {
          _id: 'settings:feed-proxy',
          type: 'settings',
          proxyUrl,
        };
      }

      await this.databaseService.db.put(feedProxyDoc);
    } else {
      // Remove previous proxyUrl if exists
      try {
        const feedProxyDoc = await this.databaseService.db.get('settings:feed-proxy');
        await this.databaseService.db.remove(feedProxyDoc);
      } catch {}
    }
  }
}

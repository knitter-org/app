import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedProxySettingsDoc } from 'src/app/database.models';
import { DatabaseService } from 'src/app/database.service';
import CustomValidators from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-feed-proxy-settings',
  templateUrl: './feed-proxy-settings.component.html',
  styleUrls: ['./feed-proxy-settings.component.less']
})
export class FeedProxySettingsComponent {


  form = new FormGroup({
    proxyUrl: new FormControl('', [Validators.required, CustomValidators.url]),
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
    const proxyUrl = this.form.value.proxyUrl!;

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

    return this.databaseService.db.put(feedProxyDoc);
  }
}

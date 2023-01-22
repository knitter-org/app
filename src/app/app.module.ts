import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InitializationComponent } from './pages/initialization/initialization.component';
import { VerticalNavComponent } from './elements/vertical-nav/vertical-nav.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChannelsViewComponent } from './pages/channels-view/channels-view.component';
import { FeedsEditComponent } from './pages/feeds-edit/feeds-edit.component';
import { TwoColumnsLayoutComponent } from './layouts/two-columns-layout/two-columns-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedsAddComponent } from './pages/feeds-add/feeds-add.component';
import { FeedReaderService } from './feed-reader.service';
import { FeedsViewComponent } from './pages/feeds-view/feeds-view.component';
import { EntryFormatListItemComponent } from './elements/entry-format-list-item/entry-format-list-item.component';
import { EntryListComponent } from './elements/entry-list/entry-list.component';
import { ServerSettingsComponent } from './pages/settings/server-settings/server-settings.component';
import { FeedProxySettingsComponent } from './pages/settings/feed-proxy-settings/feed-proxy-settings.component';
import { MigrationComponent } from './pages/migration/migration.component';

@NgModule({
  declarations: [
    AppComponent,
    InitializationComponent,
    VerticalNavComponent,
    SettingsComponent,
    ChannelsViewComponent,
    FeedsEditComponent,
    TwoColumnsLayoutComponent,
    FeedsAddComponent,
    FeedsViewComponent,
    EntryFormatListItemComponent,
    EntryListComponent,
    ServerSettingsComponent,
    FeedProxySettingsComponent,
    MigrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [FeedReaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }

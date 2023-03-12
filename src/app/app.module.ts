import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FeedReaderService } from 'app/services/feed-reader.service';
import { ScheduledFeedFetcherService } from 'app/services/scheduled-feed-fetcher.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryListComponent } from './elements/entry-list/entry-list.component';
import { VerticalNavComponent } from './elements/vertical-nav/vertical-nav.component';
import { TwoColumnsLayoutComponent } from './layouts/two-columns-layout/two-columns-layout.component';
import { FeedsAddComponent } from './pages/feeds-add/feeds-add.component';
import { FeedsEditComponent } from './pages/feeds-edit/feeds-edit.component';
import { FeedsViewComponent } from './pages/feeds-view/feeds-view.component';
import { InitializationComponent } from './pages/initialization/initialization.component';
import { MigrationComponent } from './pages/migration/migration.component';
import { DeleteDatabaseComponent } from './pages/settings/delete-database/delete-database.component';
import { FeedProxySettingsComponent } from './pages/settings/feed-proxy-settings/feed-proxy-settings.component';
import { ServerSettingsComponent } from './pages/settings/server-settings/server-settings.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { BottomNavComponent } from './elements/bottom-nav/bottom-nav.component';
import { FeedsListComponent } from './pages/feeds-list/feeds-list.component';

@NgModule({
  declarations: [
    AppComponent,
    InitializationComponent,
    SettingsComponent,
    FeedsEditComponent,
    TwoColumnsLayoutComponent,
    FeedsViewComponent,
    ServerSettingsComponent,
    FeedProxySettingsComponent,
    MigrationComponent,
    DeleteDatabaseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FeedsAddComponent,
    EntryListComponent,
    VerticalNavComponent,
    BottomNavComponent,
    FeedsListComponent,
  ],
  providers: [FeedReaderService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _scheduledFeedFetcherService: ScheduledFeedFetcherService) {}
}

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

@NgModule({
  declarations: [
    AppComponent,
    InitializationComponent,
    VerticalNavComponent,
    SettingsComponent,
    ChannelsViewComponent,
    FeedsEditComponent,
    TwoColumnsLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

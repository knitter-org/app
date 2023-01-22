import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitializationComponent } from './pages/initialization/initialization.component';
import { InitializedGuardService } from './pages/initialization/initialized-guard.service';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChannelsViewComponent } from './pages/channels-view/channels-view.component';
import { FeedsEditComponent } from './pages/feeds-edit/feeds-edit.component';
import { TwoColumnsLayoutComponent } from './layouts/two-columns-layout/two-columns-layout.component';
import { VerticalNavComponent } from './elements/vertical-nav/vertical-nav.component';
import { FeedsAddComponent } from './pages/feeds-add/feeds-add.component';
import { FeedsViewComponent } from './pages/feeds-view/feeds-view.component';
import { MigrationComponent } from './pages/migration/migration.component';
import { MigratedGuard } from './pages/migration/migrated.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'channels/timeline' },
  { path: 'initialize', component: InitializationComponent },
  { path: 'migrate', component: MigrationComponent, canActivate: [InitializedGuardService] },
  {
    path: '',
    component: TwoColumnsLayoutComponent,
    canActivateChild: [InitializedGuardService, MigratedGuard],
    children: [
      { path: '', component: VerticalNavComponent, outlet: 'aside' },
      { path: 'channels/:id', component: ChannelsViewComponent },
      { path: 'feeds/add', component: FeedsAddComponent },
      { path: 'feeds/:id/edit', component: FeedsEditComponent },
      { path: 'feeds/:id', component: FeedsViewComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },

  { path: 'channels', pathMatch: 'full', redirectTo: 'channels/timeline' },
  // TODO define wildcard route { path: '**', component: <component-name> }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

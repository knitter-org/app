import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitializationComponent } from './pages/initialization/initialization.component';
import { InitializedGuardService } from './pages/initialization/initialized-guard.service';
import { TimelineComponent } from './pages/timeline/timeline.component';

const routes: Routes = [
  { path: 'initialize', component: InitializationComponent },
  { path: 'timeline', component: TimelineComponent, canActivate: [InitializedGuardService] },

  { path: '', pathMatch: 'full', redirectTo: 'timeline' },
  // TODO define wildcard route { path: '**', component: <component-name> }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

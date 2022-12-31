import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitializationComponent } from './initialization/initialization.component';
import { InitializedGuardService } from './initialization/initialized-guard.service';
import { TimelineComponent } from './pages/timeline/timeline.component';

const routes: Routes = [
  { path: 'timeline', component: TimelineComponent, canActivate: [InitializedGuardService] },
  { path: 'initialize', component: InitializationComponent },
  { path: '', pathMatch: 'full', redirectTo: 'timeline' },
  // TODO define wildcard route { path: '**', component: <component-name> }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

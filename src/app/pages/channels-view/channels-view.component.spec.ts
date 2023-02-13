import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { EntryListComponent } from 'app/elements/entry-list/entry-list.component';

import { ChannelsViewComponent } from './channels-view.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('ChannelsViewComponent', () => {
  let spectator: Spectator<ChannelsViewComponent>;
  const createComponent = createComponentFactory({
    component: ChannelsViewComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 123 }),
        },
      },
    ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { EntryListComponent } from 'app/elements/entry-list/entry-list.component';

import { ChannelsViewComponent } from './channels-view.component';

describe('ChannelsViewComponent', () => {
  let component: ChannelsViewComponent;
  let fixture: ComponentFixture<ChannelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [ ChannelsViewComponent, EntryListComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryFormatListItemComponent } from './entry-format-list-item.component';

describe('EntryFormatListItemComponent', () => {
  let component: EntryFormatListItemComponent;
  let fixture: ComponentFixture<EntryFormatListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryFormatListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryFormatListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedService } from 'src/app/feed.service';

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
    component.entry = {
      _id: FeedService.ID_PREFIX+'testfoo',
      type: 'entry',
      title: 'Test',
      text: 'Test text',
      url: 'https://example.com',
      publishedAt: new Date(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

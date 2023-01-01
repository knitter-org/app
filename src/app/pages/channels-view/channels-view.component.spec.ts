import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsViewComponent } from './channels-view.component';

describe('ChannelsViewComponent', () => {
  let component: ChannelsViewComponent;
  let fixture: ComponentFixture<ChannelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelsViewComponent ]
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

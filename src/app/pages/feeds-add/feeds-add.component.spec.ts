import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FeedsAddComponent } from './feeds-add.component';

describe('FeedsAddComponent', () => {
  let component: FeedsAddComponent;
  let fixture: ComponentFixture<FeedsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FeedsAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { FeedsEditComponent } from './feeds-edit.component';

describe('FeedsEditComponent', () => {
  let component: FeedsEditComponent;
  let fixture: ComponentFixture<FeedsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, ReactiveFormsModule],
      declarations: [ FeedsEditComponent ],
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

    fixture = TestBed.createComponent(FeedsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

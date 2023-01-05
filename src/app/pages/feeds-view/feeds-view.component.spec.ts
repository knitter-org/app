import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';

import { FeedsViewComponent } from './feeds-view.component';

describe('FeedsViewComponent', () => {
  let component: FeedsViewComponent;
  let fixture: ComponentFixture<FeedsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, FontAwesomeModule],
      declarations: [ FeedsViewComponent ],
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

    fixture = TestBed.createComponent(FeedsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { EntryListComponent } from 'app/elements/entry-list/entry-list.component';
import { FeedsViewComponent } from './feeds-view.component';

describe('FeedsViewComponent', () => {
  let component: FeedsViewComponent;
  let fixture: ComponentFixture<FeedsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, FontAwesomeModule],
      declarations: [ FeedsViewComponent, EntryListComponent ],
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

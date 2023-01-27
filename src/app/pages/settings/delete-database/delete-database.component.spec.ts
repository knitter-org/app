import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDatabaseComponent } from './delete-database.component';

describe('DeleteDatabaseComponent', () => {
  let component: DeleteDatabaseComponent;
  let fixture: ComponentFixture<DeleteDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPencilComponent } from './loading-pencil.component';

describe('LoadingPencilComponent', () => {
  let component: LoadingPencilComponent;
  let fixture: ComponentFixture<LoadingPencilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPencilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingPencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

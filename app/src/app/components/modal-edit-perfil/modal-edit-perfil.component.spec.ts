import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditPerfilComponent } from './modal-edit-perfil.component';

describe('ModalEditPerfilComponent', () => {
  let component: ModalEditPerfilComponent;
  let fixture: ComponentFixture<ModalEditPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

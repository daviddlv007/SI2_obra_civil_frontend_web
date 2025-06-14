import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraServicioCreateComponent } from './compra-servicio-create.component';

describe('CompraServicioCreateComponent', () => {
  let component: CompraServicioCreateComponent;
  let fixture: ComponentFixture<CompraServicioCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraServicioCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraServicioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

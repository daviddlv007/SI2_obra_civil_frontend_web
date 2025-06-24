import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraEquipoCreateComponent } from './compra-equipo-create.component';

describe('CompraEquipoCreateComponent', () => {
  let component: CompraEquipoCreateComponent;
  let fixture: ComponentFixture<CompraEquipoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraEquipoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraEquipoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

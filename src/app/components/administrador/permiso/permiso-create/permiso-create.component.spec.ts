import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoCreateComponent } from './permiso-create.component';

describe('PermisoCreateComponent', () => {
  let component: PermisoCreateComponent;
  let fixture: ComponentFixture<PermisoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

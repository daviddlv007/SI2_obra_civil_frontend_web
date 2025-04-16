import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoUpdateComponent } from './permiso-update.component';

describe('PermisoUpdateComponent', () => {
  let component: PermisoUpdateComponent;
  let fixture: ComponentFixture<PermisoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisoUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraReportesComponent } from './compra-reportes.component';

describe('CompraReportesComponent', () => {
  let component: CompraReportesComponent;
  let fixture: ComponentFixture<CompraReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

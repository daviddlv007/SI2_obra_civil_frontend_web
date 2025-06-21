import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraCreateComponent } from './compra-create.component';

describe('CompraCreateComponent', () => {
  let component: CompraCreateComponent;
  let fixture: ComponentFixture<CompraCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

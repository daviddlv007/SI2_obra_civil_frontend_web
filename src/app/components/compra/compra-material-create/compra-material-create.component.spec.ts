import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraMaterialCreateComponent } from './compra-material-create.component';

describe('CompraMaterialCreateComponent', () => {
  let component: CompraMaterialCreateComponent;
  let fixture: ComponentFixture<CompraMaterialCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraMaterialCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraMaterialCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

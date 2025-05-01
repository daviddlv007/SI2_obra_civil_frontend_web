import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObracivilCreateComponent } from './obracivil-create.component';

describe('ObracivilCreateComponent', () => {
  let component: ObracivilCreateComponent;
  let fixture: ComponentFixture<ObracivilCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObracivilCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObracivilCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

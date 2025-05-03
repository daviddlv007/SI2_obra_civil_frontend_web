import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObracivilShowComponent } from './obracivil-show.component';

describe('ObracivilShowComponent', () => {
  let component: ObracivilShowComponent;
  let fixture: ComponentFixture<ObracivilShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObracivilShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObracivilShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

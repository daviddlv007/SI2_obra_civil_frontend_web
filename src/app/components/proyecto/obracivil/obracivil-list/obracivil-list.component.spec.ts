import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObracivilListComponent } from './obracivil-list.component';

describe('ObracivilListComponent', () => {
  let component: ObracivilListComponent;
  let fixture: ComponentFixture<ObracivilListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObracivilListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObracivilListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

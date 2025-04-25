import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObracivilUpdateComponent } from './obracivil-update.component';

describe('ObracivilUpdateComponent', () => {
  let component: ObracivilUpdateComponent;
  let fixture: ComponentFixture<ObracivilUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObracivilUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObracivilUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

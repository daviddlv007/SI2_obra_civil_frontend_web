import { TestBed } from '@angular/core/testing';

import { ObracivilService } from './obracivil.service';

describe('ObracivilService', () => {
  let service: ObracivilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObracivilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

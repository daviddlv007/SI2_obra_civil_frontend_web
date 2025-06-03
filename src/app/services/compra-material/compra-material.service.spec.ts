import { TestBed } from '@angular/core/testing';

import { CompraMaterialService } from './compra-material.service';

describe('CompraMaterialService', () => {
  let service: CompraMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

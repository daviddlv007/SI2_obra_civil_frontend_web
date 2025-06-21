import { TestBed } from '@angular/core/testing';

import { CompraServicioService } from './compra-servicio.service';

describe('CompraServicioService', () => {
  let service: CompraServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

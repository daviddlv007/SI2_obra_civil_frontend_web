import { TestBed } from '@angular/core/testing';

import { CompraEquipoService } from './compra-equipo.service';

describe('CompraEquipoService', () => {
  let service: CompraEquipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraEquipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
